import { Router, Request, Response } from "express";
import { confirmEmail, validateToken } from "../controllers/v1/emailService";

const emailRoute = Router();

emailRoute.get(
  "/:type=:token&e=:email",
  async (req: Request, res: Response) => {
    if (req.params.type === "c") {
      if (await confirmEmail(req.params.token, req.params.email))
        res.send("Email succesfully confirmed!");
    } else if (req.params.type === "r") {
      if (await validateToken(req.params.token, "pw", req.params.email)) {
        //TODO redirect to reset page, they input a password
      }
    } else {
      res.sendStatus(404); // invalid request
    }

    res.send("An error occurred. The link may be expired or invalid.");
  }
);

export default emailRoute;
