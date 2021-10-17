import { Router, Request, Response } from "express";
import { confirmEmail, validateToken } from "../controllers/emailService";
// import { confirmEmail, resetPassword } from "../controllers/mailService";

const PW_RESET = "pw";
const EMAIL_CONF = "conf";

const emailRoute = Router();

/* Account Email Verification */
emailRoute.get(
  "/:type=:token&e=:email",
  async (req: Request, res: Response) => {
    if (req.params.type === "c") {
      if (await confirmEmail(req.params.token, req.params.email))
        res.send("Email succesfully confirmed!");
    } else if (req.params.type === "r") {
      if (await validateToken(req.params.token, "pw", req.params.email)) {
        // redirect to reset page, they input a password
      }
    } else {
      res.sendStatus(404); // invalid request
    }

    res.send("An error occurred. The link may be expired or invalid.");
  }
);

export default emailRoute;
