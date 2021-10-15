import { dbSync, makeUser } from "../../models/tests/testHelpers";
import { User } from '../../models/user'
import db from '../../models/index'
import { sendConfirmation } from "../mailService";

dbSync()

const UserModel: typeof User = db.User; 

describe('Register and Confirm User ', () => {
    describe('User Creation', () => {
        test("Create basic users with valid name and email", async () => {
            await expect(makeUser("testPerson1", "pouya.ghiassi@mail.utoronto.ca")).resolves.toBeDefined();

        
            /* Query to see if anything was inserted */
            const testPers1 = await UserModel.findOne({ 
                where: {
                    userName: "testPerson1"
                }
            });

            
            if (testPers1 === null) // to appease typescript
                fail();

            sendConfirmation(testPers1, 'conf');
        });
    });
});
