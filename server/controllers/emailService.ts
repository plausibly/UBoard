import { User } from "../models/user";
import db from "../models/index";
import sgMail from "@sendgrid/mail";
require("dotenv").config();
sgMail.setApiKey(<string>process.env.SENDGRID_API);

const userModel: typeof User = db.User;

const CONF_TYPE = "c";
const RESET_TYPE = "r";

/* Generates and returns a random alphanumeric string. Used in validating
    emails. */
function generateRandom(): string {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var str = "";

  for (var i = 0; i < alphabet.length; i++) {
    str += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  return str;
}

/* Assign a specific confirmation token to a user and send them an email. The email sent will be formatted based on
if type is CONF_TYPE (account email confirmation) or RESET_TYPE. */
export async function sendConfirmation(user: User, type: string) {
  /* URL Setup */
  const confToken = generateRandom();

  var dateExpires = new Date();
  dateExpires.setUTCHours(dateExpires.getUTCHours() + 12); // expires 12hrs from now

  try {
    await userModel.update(
      {
        // assign token to user, note that generating a new token invalidates any previous ones
        confirmationToken: `${type}:${confToken}`,
        confirmationTokenExpires: dateExpires,
      },
      { where: { id: user.id } }
    );
  } catch (err) {
    return false;
  }

  /* Send the actual email */
  var emailURL: string;
  var subjectLine: string;
  var body: string;

  if (type === CONF_TYPE) {
    emailURL = `${process.env.WEBSITE}/c=${confToken}&e=${user.email}`;
    subjectLine = "UBoard - Confirm your email address";

    body = `Thank you for signing up to UBoard, ${user.firstName}. \n
        To continue with your account registration, please confirm your email address: ${emailURL}
        `;
  } else {
    emailURL = `${process.env.WEBSITE}/r=${confToken}&e=${user.email}`;
    subjectLine = "UBoard - Password Reset Requested";
    body = `Hello, ${user.firstName}. \n
        A password reset has been requested for the account: ${user.userName}. To reset your password, click the link below. 
        ${emailURL}
        `;
  }

  const msg = {
    to: user.email,
    from: <string>process.env.FROM_EMAIL,
    subject: subjectLine,
    text: body,
    html: body,
  };
  sgMail.send(msg).catch((error: any) => {
    console.error(error);
    return false;
  });

  return true;
}

/* Check whether the provided token matches the requested confirmation type (reset or account) 
  for the provided user email, and that it is not expired. Returns true on success, or false on failure. */
export async function validateToken(
  token: string,
  type: string,
  email: string
) {
  const dbTokenFormat = `${type}:${token}`; // we stored 'type' infront of the actual token, used to validate the type

  try {
    const target = await userModel.findOne({ where: { email: email } });
    const currTime = new Date().getTime();
    if (
      !target ||
      target.confirmationToken !== dbTokenFormat ||
      target.confirmationTokenExpires.getTime() < currTime
    )
      return false;
  } catch {
    return false;
  }

  return true;
}

/* Confirm the account associated with the 'token' confirmation. Return true on success, and false if the token was invalid
    or another error occurred. */
export async function confirmEmail(
  token: string,
  email: string
): Promise<boolean> {
  if (!(await validateToken(token, CONF_TYPE, email))) return false;

  /* Confirm the User account and consume the token */
  try {
    await userModel.update(
      {
        confirmed: true,
        confirmationToken: "",
      },
      { where: { email: email } }
    );
  } catch {
    return false;
  }
  return true;
}

export async function resetPassword(
  token: string,
  email: string,
  newPass: string
) {
  if (!(await validateToken(token, RESET_TYPE, email))) return false;

  const pw = newPass; // ENCRYPT & SALT this

  /* Change their password & Consume token */
  try {
    await userModel.update(
      {
        password: newPass,
        confirmationToken: "",
      },
      { where: { email: email } }
    );
  } catch {
    return false;
  }

  return true;
}
