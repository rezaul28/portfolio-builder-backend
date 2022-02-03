const route = require("express").Router();
const multer = require("multer");

var fs = require("fs");
const file_saver = require("../middleware/file_saver");

const {SUCCESS, FAILURE} = require("../api_response");

const config = require("config");
const BACKEND_URL_DEV = config.get("BACKEND_URL_DEV");

const upload_files = multer({
  storage: file_saver.fileStorage,
  fileFilter: file_saver.photo,
});

{
  /**
   * @swagger
   * /file/upload:
   *  post:
   *      summary:
   *      description:
   *      tags:
   *          - File
   *      consumes:
   *          - multipart/form-data
   *      parameters:
   *              -   in: formData
   *                  name: photo
   *                  type: array
   *                  items:
   *                      type: file
   *                  collectionFormat: multi
   *      responses:
   *          200:
   *              description: success
   *          400:
   *              description: Error
   *
   */
}

route.post(
  "/upload",
  upload_files.fields([
    {
      name: "photo",
    },
  ]),
  async (req, res) => {
    for (let i = 0; i < req.files["photo"].length; i++) {
      req.files["photo"][i].path =
        BACKEND_URL_DEV + "/" + req.files["photo"][i].path;
    }
    res.send(req.files);
  }
);
module.exports = route;
