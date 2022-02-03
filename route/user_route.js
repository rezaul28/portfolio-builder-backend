const route = require("express").Router();
const {SUCCESS} = require("../api_response");
const controller = require("../controller/user/user_controller");
const validator = require("../controller/user/user_validation");

const config = require("config");
const SESSION_NAME = config.get("SESSION_NAME");

const passport = require("passport");
const {check_user_validity} = require("../middleware/authenticate_user");
route.use(passport.initialize());
{
  /**
   * @swagger
   * /user/signup:
   *  post:
   *      summary:
   *      tags:
   *          - user
   *      consumes:
   *          - application/json
   *      parameters:
   *              -   in: body
   *                  name: body
   *                  required: true
   *                  schema:
   *                      type: object
   *                      required:
   *                          - name
   *                          - email
   *                          - password
   *                      properties:
   *                          name:
   *                              type: string
   *                              required : true
   *                          email:
   *                              type: string
   *                              required : true
   *                          password:
   *                              type: string
   *                              required : true
   *      responses:
   *          200:
   *              description: success
   *          400:
   *              description: Error
   *          401:
   *              description: Unauthorize
   *
   */
}

route.post("/signup", validator.signup_validation, async (req, res) => {
  let result = await controller.signup(req);
  if (result.failed) {
    res.status(result.status).send({
      msg: result.msg,
    });
    return;
  } else {
    res.cookie(SESSION_NAME, result).send({
      [SESSION_NAME]: result,
    });
    return;
  }
});

{
  /**
   * @swagger
   * /user/signin:
   *  post:
   *      summary:
   *      tags:
   *          - user
   *      consumes:
   *          - application/json
   *      parameters:
   *              -   in: body
   *                  name: body
   *                  required: true
   *                  schema:
   *                      type: object
   *                      required:
   *                          - email
   *                          - password
   *                      properties:
   *                          email:
   *                              type: string
   *                              required : true
   *                          password:
   *                              type: string
   *                              required : true
   *      responses:
   *          200:
   *              description: success
   *          400:
   *              description: Error
   *          401:
   *              description: Unauthorize
   *
   */
}

route.post("/signin", validator.signin_validation, async (req, res) => {
  let result = await controller.signin(req);
  if (result.failed) {
    res.status(result.status).send({
      msg: result.msg,
    });
    return;
  } else {
    res.cookie(SESSION_NAME, result).send({
      [SESSION_NAME]: result,
    });
    return;
  }
});
{
  /**
   * @swagger
   * /user/profile:
   *  get:
   *      summary:
   *      tags:
   *          - user
   *      consumes:
   *          - application/json
   *      responses:
   *          200:
   *              description: success
   *          400:
   *              description: Error
   *          401:
   *              description: Unauthorize
   *
   */
}

route.get("/profile", check_user_validity, async (req, res) => {
  let result = await controller.profile(req);
  if (result.failed) {
    res.status(result.status).send({
      msg: result.msg,
    });
    return;
  } else {
    res.send(SUCCESS(result));
    return;
  }
});

{
  /**
   * @swagger
   * /user/edit_profile:
   *  put:
   *      summary:
   *      tags:
   *          - user
   *      consumes:
   *          - application/json
   *      parameters:
   *              -   in: body
   *                  name: body
   *                  required: true
   *                  schema:
   *                      type: object
   *                      required:
   *                      properties:
   *                          name:
   *                              type: string
   *                          portfolio:
   *                              type: string
   *      responses:
   *          200:
   *              description: success
   *          400:
   *              description: Error
   *          401:
   *              description: Unauthorize
   *
   */
}

route.put(
  "/edit_profile",
  check_user_validity,
  validator.edit_validation,
  async (req, res) => {
    let result = await controller.edit_profile(req);
    if (result.failed) {
      res.status(result.status).send({
        msg: result.msg,
      });
      return;
    } else {
      res.send(SUCCESS(result));
      return;
    }
  }
);

{
  /**
   * @swagger
   * /user/get-new-otp:
   *  get:
   *      description: this will a new otp for account verification and send it as sms to phone number. for testing it will be 123456 always
   *      tags:
   *          - user
   *      responses:
   *          200:
   *              description: successful
   */
}

route.get("/get-new-otp", check_user_validity, async (req, res) => {
  let result = await controller.generate_otp_token(req);
  if (result.failed) {
    res.status(result.status).send({
      msg: result.msg,
    });
    return;
  } else {
    res.send(SUCCESS("New OTP generated"));
    return;
  }
});

{
  /**
   * @swagger
   * /user/verify-account:
   *  put:
   *      summary:
   *      tags:
   *          - user
   *      consumes:
   *          - application/json
   *      parameters:
   *              -   in: body
   *                  name: body
   *                  required: true
   *                  schema:
   *                      type: object
   *                      required:
   *                        - otp
   *                      properties:
   *                          otp:
   *                              type: string
   *                              required: true
   *      responses:
   *          200:
   *              description: success
   *          400:
   *              description: Error
   *          401:
   *              description: Unauthorize
   *
   */
}

route.put("/verify-account", check_user_validity, async (req, res) => {
  let result = await controller.verify_account(req);
  if (result.failed) {
    res.status(result.status).send({
      msg: result.msg,
    });
    return;
  } else {
    res.send(SUCCESS("Your account is verified successfully"));
    return;
  }
});

{
  /**
   * @swagger
   * /user/forgot-pass-get-otp:
   *  put:
   *      description: this will generate an otp and send to phone number. for testing the otp will be always 123456
   *      tags:
   *          - user
   *      consumes:
   *          - application/json
   *      parameters:
   *              -   in: body
   *                  name: body
   *                  required: true
   *                  schema:
   *                      type: object
   *                      required:
   *                        - email
   *                      properties:
   *                          email:
   *                              type: string
   *                              required: true
   *      responses:
   *          200:
   *              description: success
   *          400:
   *              description: Error
   *          401:
   *              description: Unauthorize
   *
   */
}

route.put("/forgot-pass-get-otp", async (req, res) => {
  let result = await controller.forgot_pass_get_otp(req);
  if (result.failed) {
    res.status(result.status).send({
      msg: result.msg,
    });
    return;
  } else {
    res.send(SUCCESS("An OTP has been sent to this number"));
    return;
  }
});

{
  /**
   * @swagger
   * /user/set-pass-forget-pass:
   *  put:
   *      summary:
   *      tags:
   *          - user
   *      consumes:
   *          - application/json
   *      parameters:
   *              -   in: body
   *                  name: body
   *                  required: true
   *                  schema:
   *                      type: object
   *                      required:
   *                        - email
   *                        - otp
   *                        - password
   *                      properties:
   *                          email:
   *                              type: string
   *                              required: true
   *                          otp:
   *                              type: string
   *                              required: true
   *                          password:
   *                              type: string
   *                              required: true
   *      responses:
   *          200:
   *              description: success
   *          400:
   *              description: Error
   *          401:
   *              description: Unauthorize
   *
   */
}

route.put("/set-pass-forget-pass", async (req, res) => {
  let result = await controller.set_pass_forgot_pass(req);
  if (result.failed) {
    res.status(result.status).send({
      msg: result.msg,
    });
    return;
  } else {
    res.send(
      SUCCESS("Your password has been updated successfully. Login to continue")
    );
    return;
  }
});

module.exports = route;
