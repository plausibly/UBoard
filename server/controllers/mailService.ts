import { User } from "../models/user";
import db from "../models/index"
import sgMail from '@sendgrid/mail';
const jwt = require('jsonwebtoken');
require('dotenv').config();
sgMail.setApiKey(<string>process.env.SENDGRID_API);
const SECRET = process.env.JWT_SECRET;


/* Generate and send a specific email confirmation to the User. If type is
    "pw", send a password reset email. If type is "conf", send an account confirmation email. */
export function sendConfirmation(user: User, type: string){
    const confToken = jwt.sign({
        id: user.id,
        expiresIn: "12h",
        type: type
    }, SECRET); 

    let subjectLine: string;
    let body: string;

    if (type === 'conf') {
        subjectLine = "UBoard - Confirm your email address";

        body = 
        `Thank you for signing up to UBoard, ${user.firstName}. \n
        To continue with your account registration, please confirm your email address: ${confToken}
        `

    }
    else {
        subjectLine = "UBoard - Password Reset Requested";
        body = 
        `Hello, ${user.firstName}. \n
        A password reset has been requested for the account: ${user.userName}. To reset your password, click the link below. 
        ${confToken}
        `

    }
    
    const msg = {
        to: user.email,
        from: <string>process.env.FROM_EMAIL,
        subject: subjectLine,
        text: body,
        html: body,
    }
    sgMail
    .send(msg)
    // .then(() => {
    //     console.log('Email sent')
    // })
    .catch((error: any) => {
        console.error(error)
        return false;
    })

    return true;
}

/* Check whether the provided token is valid and matches type. Returns the decoded token 
if it is valid, and NULL otherwise. */
export function checkEmailToken(token: string, type: string) {
    try {
        const decoded = jwt.verify(token, SECRET);

        if (decoded.type !== type)
            return null;

        return decoded;
    }
    catch {
        return null;
    }

}

/* Confirm the account associated with the 'token' confirmation. Return true on success, and false if the token was invalid
    or another error occurred. */
export async function confirmEmail(token: string): Promise<boolean> {
    const decodedToken = checkEmailToken(token, "conf");

    if (!decodedToken)
        return false;

    /* Confirm the User account */
    try {
        await db.User.update({ confirmed: true }, { where: { id: decodedToken.id } })
    } catch {
         return false; 
    }

    return true;
}

export async function resetPassword(token: string, newPass: string) {
    
    const decodedToken = checkEmailToken(token, "conf");

    if (!decodedToken)
        return false;

    const pw = newPass; // ENCRYPT & SALT this

    /* Confirm the User account */
    try {
        await db.User.update({ password: newPass }, { where: { id: decodedToken.id } })
    } catch {
         return false; 
    }

    return true;
}

