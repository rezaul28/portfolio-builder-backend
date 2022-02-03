const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);

const config = require("config");

const STRING_MIN = config.get("STRING_MIN");
const STRING_MAX = config.get("STRING_MAX");
const delete_empty_field = (obj) => {
  Object.keys(obj).forEach(
    (key) => (obj[key] === undefined || obj[key] === "") && delete obj[key]
  );
  return obj;
};
const {FAILURE} = require("../../api_response");

const signup_schema = Joi.object({
  name: Joi.string().required().min(STRING_MIN).max(STRING_MAX),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(STRING_MIN).max(STRING_MAX),
});
const signup_validation = (data) => {
  console.log(data);
  data = delete_empty_field(data);
  const val = signup_schema.validate(data);
  if (!!val.error) {
    return val.error.details[0].message;
  } else {
    return false; // something falsy
  }
};
module.exports.signup_validation = (req, res, next) => {
  const validation_error = signup_validation(req.body);
  if (!!validation_error) {
    res.status(400).send(FAILURE(validation_error));
    return validation_error;
  } else {
    next();
  }
};

const signin_schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(STRING_MIN).max(STRING_MAX),
});
const signin_validation = (data) => {
  data = delete_empty_field(data);
  const val = signin_schema.validate(data);
  if (!!val.error) {
    return val.error.details[0].message;
  } else {
    return false; // something falsy
  }
};
module.exports.signin_validation = (req, res, next) => {
  const validation_error = signin_validation(req.body);
  if (!!validation_error) {
    res.status(400).send(FAILURE(validation_error));
    return validation_error;
  } else {
    next();
  }
};

const edit_schema = Joi.object({
  name: Joi.string().min(STRING_MIN).max(STRING_MAX),
  portfolio: Joi.string(),
});
const edit_validation = (data) => {
  data = delete_empty_field(data);
  const val = edit_schema.validate(data);
  if (!!val.error) {
    return val.error.details[0].message;
  } else {
    return false; // something falsy
  }
};
module.exports.edit_validation = (req, res, next) => {
  const validation_error = edit_validation(req.body);
  if (!!validation_error) {
    res.status(400).send(FAILURE(validation_error));
    return validation_error;
  } else {
    next();
  }
};

const get_schema = Joi.object({
  filter: Joi.string(),
  sort: Joi.string().valid(
    "name_ascending",
    "name_descending",
    "time_ascending",
    "time_descending"
  ),
  id: Joi.objectId(),
  page: Joi.number(),
});

const get_validation = (data) => {
  data = delete_empty_field(data);
  const val = get_schema.validate(data);
  if (!!val.error) {
    return val.error.details[0].message;
  } else {
    return false; // something falsy
  }
};
module.exports.get_validation = (req, res, next) => {
  const validation_error = get_validation(req.query);
  if (!!validation_error) {
    res.status(400).send(FAILURE(validation_error));
    return validation_error;
  } else {
    next();
  }
};

const assign_subject_schema = Joi.object({
  course_id: Joi.objectId().required(),
  student_id: Joi.objectId().required(),
});

const assign_subject_validation = (data) => {
  data = delete_empty_field(data);
  const val = assign_subject_schema.validate(data);
  if (!!val.error) {
    return val.error.details[0].message;
  } else {
    return false; // something falsy
  }
};
module.exports.assign_subject_validation = (req, res, next) => {
  const validation_error = assign_subject_validation(req.body);
  if (!!validation_error) {
    res.status(400).send(FAILURE(validation_error));
    return validation_error;
  } else {
    next();
  }
};

const get_for_student_schema = Joi.object({
  module_id: Joi.objectId().required(),
});
const get_for_student_validation = (data) => {
  data = delete_empty_field(data);
  const val = get_for_student_schema.validate(data);
  if (!!val.error) {
    return val.error.details[0].message;
  } else {
    return false; // something falsy
  }
};
module.exports.get_for_student_validation = (req, res, next) => {
  const validation_error = get_for_student_validation(req.query);
  if (!!validation_error) {
    res.status(400).send(FAILURE(validation_error));
    return validation_error;
  } else {
    next();
  }
};
