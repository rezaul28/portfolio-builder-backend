// const Student = require("../model/Student");
const {FAILURE, STATUS} = require("../api_response");
const jwt = require("jsonwebtoken");
const config = require("config");

const SESSION_NAME = config.get("SESSION_NAME");
const SESSION_SECRET = config.get("SESSION_SECRET");
const {create, get} = require("../Database_plugin/database_controller");

module.exports.check_user_validity = async (req, res, next) => {
  try {
    var session = req.cookies[SESSION_NAME]
      ? req.cookies[SESSION_NAME]
      : req.headers[SESSION_NAME];
    const tokenized = jwt.verify(session, SESSION_SECRET);
    // let customer = await Student.findById(tokenized.uid, {
    //   password: 0,
    //   otp_token: 0,
    // });
    let user = await get({
      query: {db: "User"},
      filter: {
        _id: tokenized.uid,
      },
      project: {password: 0, otp_token: 0},
    });
    user=user[0];
    if (!user) {
      res.status(STATUS.UNAUTHORIZED).send(FAILURE());
      return;
    }
    req.user = user;
    req.user.user_type = "student";
    next();
    return;
  } catch (error) {
    res.status(STATUS.UNAUTHORIZED).send(FAILURE(error.message));
    return;
  }
};
