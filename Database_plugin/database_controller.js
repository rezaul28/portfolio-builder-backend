// test-setup.js
const mongoose = require("mongoose");
const config = require("config");
const Database = config.get("Database");

module.exports.mongo_create = async (req) => {
  return await new mongoose.model(req.query.db)(req.data).save();
};

module.exports.mongo_get = async (req) => {
  let search_filter = {};
  let project = {};
  Object.keys(req.filter).forEach((key) => {
    search_filter[key] = req.filter[key];
  });
  Object.keys(req.project).forEach((key) => {
    project[key] = req.project[key];
  });
  console.log(search_filter);
  console.log(project);
  return await mongoose.model(req.query.db).find(search_filter, project);
};

module.exports.mongo_update_one = async (req) => {
  let search_filter = {};
  let project = {};
  Object.keys(req.filter).forEach((key) => {
    search_filter[key] = req.filter[key];
  });
  Object.keys(req.project).forEach((key) => {
    project[key] = req.project[key];
  });
  console.log(search_filter);
  console.log(project);
  return await mongoose
    .model(req.query.db)
    .findOneAndUpdate(
      search_filter,
      {$set: req.data},
      {new: true, useFindAndModify: false, projection: {...project}}
    );
};

module.exports.create = async req=>{
  if(Database=="mongo"){
    return await mongo_create()
  }
}


module.exports.get = async req=>{
  if(Database=="mongo"){
    return await mongo_get()
  }
}


module.exports.update_one = async req=>{
  if(Database=="mongo"){
    return await mongo_update_one()
  }
}