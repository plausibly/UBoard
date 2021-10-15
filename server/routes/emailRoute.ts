import { Router, Request, Response } from "express";
import {
  confirmEmail,
  checkEmailToken,
  resetPassword,
} from "../controllers/mailService";

const emailRoute = Router();

/* Account Email Verification */
emailRoute.get("/v=:token", async (req: Request, res: Response) => {
  const status = await confirmEmail(req.params.token);
  if (status) res.send("Email succesfully confirmed");
  // Invalid token or error occurred
  else res.sendStatus(404);
});

/* Password Resets */
emailRoute.get("/r=:token/p=:newpw", (req: Request, res: Response) => {
  const decodedToken = checkEmailToken(req.params.token, "pw");

  if (!decodedToken) res.sendStatus(404);

  /* Token valid, send them to a page to enter new password */

  // FOR TESTING. NEWPW..
  if (decodedToken != null) resetPassword(decodedToken, req.params.newpw);

  res.send("Success");
});

export default emailRoute;
