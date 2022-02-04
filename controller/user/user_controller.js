const {STATUS} = require("../../api_response");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const SESSION_SECRET = config.get("SESSION_SECRET");
const SALT_ROUND = 11;
var voucher_codes = require("voucher-code-generator");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const {
  create,
  get,
  update_one,
} = require("../../Database_plugin/database_controller");
const User = require("../../model/User");

const create_otp = async () =>
  voucher_codes.generate({
    length: 6,
    count: 1,
    charset: "0123456789",
  })[0];

const hash_password = async (password) => {
  return bcrypt.hashSync(password, SALT_ROUND);
};
const generate_token = async (data, days, hours, mins) =>
  jwt.sign(data, SESSION_SECRET, {
    expiresIn: days * hours * mins * 60,
  });
const match_password = async (login_password, user_password) =>
  bcrypt.compareSync(login_password, user_password);
module.exports.signup = async (req) => {
  let data = req.body;
  try {
    data.password = await hash_password(data.password);
    let user = await create({query: {db: "User"}, data: req.body});
    return await generate_token(
      {
        uid: user._id,
      },
      30,
      24,
      60
    );
  } catch (error) {
    return {
      failed: true,
      status: STATUS.BAD_REQUEST,
      msg: error.message,
    };
  }
};

module.exports.signin = async (req) => {
  let data = req.body;
  try {
    let user = await get({
      query: {db: "User"},
      filter: {
        email: data.email,
      },
      project: {},
    });
    user = user[0];
    if (!user) throw Error("No account found with this Email address");
    if (!(await match_password(data.password, user.password)))
      throw Error("Email address and password not matched.");
    return await generate_token(
      {
        uid: user._id,
        type: "User",
      },
      30,
      24,
      60
    );
  } catch (error) {
    return {
      failed: true,
      status: STATUS.BAD_REQUEST,
      msg: error.message,
    };
  }
};

module.exports.profile = async (req) => {
  return req.user;
};

module.exports.edit_profile = async (req) => {
  let data = req.body;
  try {
    console.log(req.user);
    let user = await update_one({
      query: {db: "User"},
      filter: {
        _id: req.user._id,
      },
      data,
      project: {password: 0, otp_token: 0},
    });
    console.log(user);
    return true;
  } catch (error) {
    return {
      failed: true,
      status: STATUS.BAD_REQUEST,
      msg: error.message,
    };
  }
};

module.exports.generate_otp_token = async (req) => {
  let otp = await create_otp();
  otp = "123456"; //test purpose. in production this line will be commented out
  //this token will valid for next five mins.
  let token = await generate_token(
    {
      otp,
      task: req.query.task || "verify", //verify or forgot
    },
    1,
    1,
    5
  );
  if (req) {
    await update_one({
      query: {db: "User"},
      filter: {
        _id: req.user._id,
      },
      data: {otp_token: token},
      project: {password: 0, otp_token: 0},
    });
  }
  return token;
};

module.exports.verify_account = async (req) => {
  let {otp} = req.body;
  try {
    let user = await get({
      query: {db: "User"},
      filter: {
        _id: req.user._id,
      },
      project: {},
    });
    user = user[0];
    if (user.otp_token == "") throw Error("Invalid OTP");
    const tokenized = jwt.verify(user.otp_token, SESSION_SECRET);
    if (tokenized.otp == otp && tokenized.task == "verify") {
      await update_one({
        query: {db: "User"},
        filter: {
          _id: user._id,
        },
        data: {verified: true, otp_token: ""},
        project: {password: 0, otp_token: 0},
      });
      return true;
    } else {
      throw Error("Invalid OTP");
    }
  } catch (error) {
    error.message = error.message.replace("jwt", "OTP");
    return {
      failed: true,
      status: STATUS.BAD_REQUEST,
      msg: error.message,
    };
  }
};

module.exports.forgot_pass_get_otp = async (req) => {
  let data = req.body;
  try {
    let user = await get({
      query: {db: "User"},
      filter: {
        email: data.email,
      },
      project: {},
    });
    user = user[0];
    if (!user) throw Error("No account found with this Email address");
    await this.generate_otp_token({
      user: user,
      query: {
        task: "forgot",
      },
    });
    return true;
  } catch (error) {
    return {
      failed: true,
      status: STATUS.BAD_REQUEST,
      msg: error.message,
    };
  }
};

module.exports.set_pass_forgot_pass = async (req) => {
  let data = req.body;
  try {
    let user = await get({
      query: {db: "User"},
      filter: {
        email: data.email,
      },
      project: {},
    });
    user = user[0];
    if (user.otp_token == "") throw Error("Invalid OTP");
    const tokenized = jwt.verify(user.otp_token, SESSION_SECRET);
    if (tokenized.otp == data.otp && tokenized.task == "forgot") {
      password = await hash_password(data.password);
      await update_one({
        query: {db: "User"},
        filter: {
          _id: user._id,
        },
        data: {password, otp_token: ""},
        project: {password: 0, otp_token: 0},
      });
      return true;
    } else {
      throw Error("Invalid OTP");
    }
  } catch (error) {
    error.message = error.message.replace("jwt", "OTP");
    return {
      failed: true,
      status: STATUS.BAD_REQUEST,
      msg: error.message,
    };
  }
};
