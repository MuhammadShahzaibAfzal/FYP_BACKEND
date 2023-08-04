const DepartementModel = require("../models/departement-model");
const ErrorHandlerService = require("../services/error-handling-service");
const userService = require("../services/user-service");
const UserModel = require("../models/user-model");

class DepartementController {
  async getAll(req, res, next) {
    try {
        const documents = await DepartementModel.find();
        return res.status(200).json({data:documents});
    } catch (error) {
        next(error);
    }
  }

  async create(req, res, next) {
    const { name, hod } = req.body;
    // validation request
    if (!name || !hod) {
      return next(ErrorHandlerService.validationError());
    }

    try {
      // check name is unique(name must be unique)
      const isExist = await DepartementModel.findOne({name});
      if(isExist){
        return next(ErrorHandlerService.alreadyExist("Departement of that name is already exist !"));
      }
      // check valid teacher(hod)
      const teacher = await userService.getUser({ _id: hod, role: "Teacher" });
      if (!teacher) {
        return next(ErrorHandlerService.badRequest("Invalid Teacher !"));
      }
      // save into db
      const document = await DepartementModel.create({ name, hod });
      // change teacher status
      teacher.role = "HOD";
      await teacher.save();
      return res.status(201).json(document);
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    const { _id } = req.params;
    try {
      const document = await DepartementModel.findById(_id);
      if (!document) {
        return next(ErrorHandlerService.notFound());
      }
      return res.status(200).json(document);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    const { _id } = req.params;
      // only hod change
      const { hod } = req.body;
    // validation request
    if (!hod) {
      return next(ErrorHandlerService.validationError());
    }

    try {
      const document = await DepartementModel.findById(_id);
      if(!document){
        return next(ErrorHandlerService.notFound());
      }
      // check teacher exist or not ?
      const teacher = await userService.getUser({ _id: hod, role: "Teacher" });
      if (!teacher) {
        return next(ErrorHandlerService.badRequest("Invalid Teacher !"));
      }
      // change previous hod role to teacher...
      const previousHOD = await userService.getUser({_id:document.hod});
      previousHOD.role = "Teacher";
      await previousHOD.save();
      // change status of new HOD
      teacher.role ="HOD";
      await teacher.save();
      // change HOD of departement
      document.hod = hod;
      document.save();

      return res.status(200).json(document);

    } catch (error) {
        next(error);
    }
  }

  async delete(req, res, next) {
    const { _id } = req.params;
    try {
      const document = await DepartementModel.findByIdAndDelete(_id);
      if (!document) {
        return next(ErrorHandlerService.notFound());
      }
      // also change role from  HOD to Teacher 
      const teacher = await UserModel.findOne({_id:document.hod});
      teacher.role = "Teacher";
      await teacher.save();
      return res.status(204).json(document);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DepartementController();
