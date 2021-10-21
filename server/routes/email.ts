import { Router, Request, Response } from "express";
import {
  confirmEmail,
  CONF_TYPE,
  RESET_TYPE,
  validateToken,
} from "../controllers/v1/emailService";

const emailRoute = Router();

emailRoute.get(
  "/:type=:token&e=:email",
  async (req: Request, res: Response) => {
    if (req.params.type === CONF_TYPE) {
      if (await confirmEmail(req.params.token, req.params.email))
        res.status(200).send("Email succesfully confirmed!");
    } else if (req.params.type === RESET_TYPE) {
      if (await validateToken(req.params.token, RESET_TYPE, req.params.email)) {
        //TODO redirect to reset page, they input a password
      }
    } else {
      res.sendStatus(404); // invalid request
    }

    res
      .status(400)
      .send("An error occurred. The link may be expired or invalid.");
  }
);

export default emailRoute;
