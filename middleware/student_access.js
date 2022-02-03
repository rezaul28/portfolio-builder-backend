const { FAILURE, STATUS } = require("../api_response");
const Module = require("../model/Module");

module.exports.student_content_access = async (req, res, next) => {
  try {
    let { module_id, course_id } = req.query;
    if (course_id) {
      if (!req.user.enrolled_courses.includes(course_id)) {
        res.status(STATUS.BAD_REQUEST).send(FAILURE("Unauthorized request"));
        return;
      }
    }
    if (module_id) {
      let module = await Module.findById(module_id);
      if (!req.user.enrolled_courses.includes(module.course_id)) {
        res.status(STATUS.BAD_REQUEST).send(FAILURE("Unauthorized request"));
        return;
    }
    }
    next();
    return;
  } catch (error) {
    res.status(STATUS.BAD_REQUEST).send(FAILURE("Unauthorized request"));
    return;
  }
};
