const UserModel = require("../models/user-model");
const ErrorHandlerService = require("../services/error-handling-service");
const userService = require("../services/user-service");
const bcrypt = require("bcrypt");

class StudentController {
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
    const regexQueryRollNumber = new RegExp(req.query.qRollNumber || "", "i");
    const filter = [
      { role: "Student" },
      { firstName: { $regex: regexQueryName } },
      { email: { $regex: regexQueryEmail } },
      { rollNumber: { $regex: regexQueryRollNumber } },
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
    const {
      email,
      firstName,
      lastName,
      fatherName,
      password,
      departement,
      batch,
      rollNumber,
    } = req.body;
    // request validation
    if (
      !email ||
      !firstName ||
      !lastName ||
      !fatherName ||
      !password ||
      !departement ||
      !batch ||
      !rollNumber
    ) {
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
      const hashedPassword = await bcrypt.hash(password, 10);
      // save into db
      const document = await userService.saveUser({
        email,
        firstName,
        lastName,
        fatherName,
        batch,
        rollNumber,
        departement,
        password: hashedPassword,
        role: "Student",
      });
      return res.status(201).json(document);
    } catch (error) {}
  }

  async get(req, res, next) {
    const { _id } = req.params;
    try {
      const document = await UserModel.findById(_id, "-__v");
      if (!document) {
        return next(ErrorHandlerService.notFound());
      }
      return res.status(200).json(document);
    } catch (error) {
      next(error);
    }
  }
// update profile pic......
  async update(req, res, next) {
      
  }

  async delete(req, res, next) {
    const { _id } = req.params;
    try {
        const document = await UserModel.findByIdAndDelete(_id);
        if(!document){
            return next(ErrorHandlerService.notFound());
        }
        return res.status(204).json({message : "Student Deleted Successfully ! "});
    } catch (error) {
        next(error);
    }
  }
}

module.exports = new StudentController();
