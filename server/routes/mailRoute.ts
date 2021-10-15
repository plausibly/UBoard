import { Router } from "express";
import { checkEmailConf  } from "../controllers/mailService";

const emailRoute = Router();

/* Account Email Verification */
emailRoute.get("/v=:token", (req: any, res: any) => {
    const status = checkEmailConf(req.params.token).then(
        (status) => {
            if (status)
                res.send("Email succesfully confirmed");
            else // token not valid
                res.sendStatus(404);
        }
    ).catch((err) => res.send(err)); // update user entry failed

});


/* Password Resets */
emailRoute.get("/r=:token", (req: any, res: any) => {
    // const status = checkConfirmation(req.params.token, "pw");

    if (status)
        res.send("Email succesfully confirmed");
    else
        res.sendStatus(404);

});


export default emailRoute;