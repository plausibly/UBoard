import { dbSync, makeUser } from "../../models/tests/testHelpers";
import { User } from "../../models/user";
import db from "../../models/index";
import {
  confirmEmail,
  CONF_TYPE,
  generateEmailToken,
  validateToken,
} from "../v1/emailService";

beforeAll(async () => {
  await dbSync().catch((err) => fail(err));

  await expect(
    // create our test user
    makeUser("confirmMe", "test@utoronto.ca")
  ).resolves.toBeDefined();
});

const UserModel: typeof User = db.User;

describe("Email account validation", () => {
  describe("emailService", () => {
    test("Generating a token properly updates User entry", async () => {
      /* Query to see if anything was inserted */
      const testPers1 = await UserModel.findOne({
        where: {
          userName: "confffirmMe",
        },
      });
      console.log(testPers1);

      if (testPers1 === null) fail(); // required to appease TS

      console.log(testPers1);

      expect(testPers1.confirmed).toBeFalsy();
      const status = await generateEmailToken(testPers1, CONF_TYPE, false);
      expect(status).toBeTruthy();
      expect(testPers1.confirmationToken).toContain(CONF_TYPE);

      const curr = new Date().getTime();
      expect(testPers1.confirmationTokenExpires.getTime()).toBeLessThan(curr); // token should not be expired since it is fresh
    });
  });
});
