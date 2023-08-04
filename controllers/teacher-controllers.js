const UserModel = require("../models/user-model");
const ErrorHandlerService = require("../services/error-handling-service");
const userService = require("../services/user-service");
const bcrypt = require("bcrypt");

class TeacherController {
  async getAll(req, res, next) {
      // pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 2;
      const skip = (page - 1) * limit;
      let totalEntries;
      let totalPages;
      // serching
      const regexQueryEmail = new RegExp(req.query.qEmail || "", "i");
      const regexQueryName = new RegExp(req.query.qName || "", "i");
      const filter = [
        { $or: [ { role: "Teacher" }, { role: "HOD" } ] },
        { firstName: { $regex: regexQueryName } },
        { email: { $regex: regexQueryEmail } },
      ];
    try {
      const documents = await UserModel.find({$and:filter}, "-__v -password ")
        .skip(skip)
        .limit(limit);
        totalEntries = await UserModel.countDocuments({$and:filter});
        totalPages = Math.ceil(totalEntries / limit);
      return res.status(200).json({ data: documents,totalEntries,totalPages });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    const { email, firstName, lastName, fatherName, password } = req.body;
    // request validation
    if (!email || !firstName || !lastName || !fatherName || !password) {
      return next(ErrorHandlerService.validationError());
    }

    try {
      // check email is already taken ? unique email allow
      const isExist = await userService.getUser({ email: email });
      if (isExist) {
        return next(
          ErrorHandlerService.alreadyExist("Email is already taken !")
        );
      }
      // hashed password before save into db
      const hashedPassword = await bcrypt.hash(password,10);
      // save into db
      const document = await userService.saveUser({
        email,
        firstName,
        lastName,
        fatherName,
        password : hashedPassword,
        role: "Teacher",
      });
      return res.status(201).json(document);
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    const {_id} = req.params;
    try {
        const document = await UserModel.findById(_id,"-password -__v");
        if(!document){
            return next(ErrorHandlerService.notFound());
        }
        return res.status(200).json(document);
    } catch (error) {
        next(error);
    }
  }

  async update(req, res, next) {
    const {_id} = req.params;
    const { firstName, lastName, fatherName, password } = req.body;
    // request validation
    if (!firstName || !lastName || !fatherName || !password) {
      return next(ErrorHandlerService.validationError());
    }

    try {
      // hashed password before update
        const hashedPassword = await bcrypt.hash(password,10);
        const document = await UserModel.findByIdAndUpdate(_id,{firstName,lastName,fatherName,password:hashedPassword},{new:true});
        if(!document){
            return next(ErrorHandlerService.notFound());
        }
        return res.status(200).json(document);
    } catch (error) {
        next(error);
    }

  }

  async delete(req, res, next) {
    const {_id} = req.params;
    try {
        // check teacher is hod of any departement
        const teacher = await UserModel.findOne({_id});
        if(teacher.role==="HOD"){
            return next(ErrorHandlerService.badRequest("Please first you need to choose another HOD of departement then you will be delete !"));
        }
        const document = await UserModel.findByIdAndDelete(_id);
        if(!document){
            return next(ErrorHandlerService.notFound());
        }
        return res.status(204).json(document);
    } catch (error) {
        next(error);
    }
  }
}

module.exports = new TeacherController();
