import { User } from "../models/user";
import db from "../models/index"


const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;


/* Generate and send a specific email confirmation to the User. If type is
    "pw", send a password reset email. If type is "conf", send an account confirmation email. */
export function sendConfirmation(user: User, type: string){

    const confToken = jwt.sign({
        id: user.id,
        expiresIn: "12h",
        type: type
    }, SECRET); 
    
}


export async function checkEmailConf(token: string): Promise<boolean> {
    try {
        const decodedToken = jwt.verify(token, SECRET);
        if (decodedToken.type !== "conf")
            return false;
        
        /* Confirm the User account */
        try {
            await db.User.update({ confirmed: true }, { where: { id: decodedToken.id } })
        } catch { return false; }


        return true;
    } 
    catch { return false; }

}
