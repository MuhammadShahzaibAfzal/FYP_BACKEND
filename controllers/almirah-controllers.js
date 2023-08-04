const AlmirahModel = require("../models/almirah-model");
const ErrorHandlerService = require("../services/error-handling-service");

class AlmirahController {
  async getAll(req, res, next) {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;
    let totalEntries;
    let totalPages;
    // serching
    const q = req.query.q || "";
    const regexQuery = new RegExp(q, "i");
    const filter = [
      { subject: { $regex: regexQuery } },
      { number: { $regex: regexQuery } },
    ];

    try {
      const documents = await AlmirahModel.find({ $or: filter }, "-__v")
        .skip(skip)
        .limit(limit);
      totalEntries = await AlmirahModel.countDocuments({ $or: filter });
      totalPages = Math.ceil(totalEntries / limit);
      return res
        .status(200)
        .json({ data: documents, totalEntries, totalPages });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    const { number, subject } = req.body;

    // validate request
    if (!number && !subject) {
      return next(ErrorHandlerService.validationError());
    }

    try {
      // check number already have ? unique number allow
      const isExist = await AlmirahModel.findOne({ number });
      if (isExist) {
        return next(ErrorHandlerService.alreadyExist());
      }

      // save into db
      const document = await AlmirahModel.create({ number, subject });

      return res.status(201).json(document);
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    const { _id } = req.params;
    try {
      const document = await AlmirahModel.findById(_id, "-__v");
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
    const { subject } = req.body;
    // validate request
    if (!subject) {
      return next(ErrorHandlerService.validationError());
    }
    try {
        const document = await AlmirahModel.findByIdAndUpdate(_id,{subject},{new:true});
        if(!document){
            return next(ErrorHandlerService.notFound());
        }
        return res.status(200).json(document);
    } catch (error) {
        next(error);
    }
  }

  async delete(req, res, next) {
    const { _id } = req.params;
    try {
        const document = await AlmirahModel.findByIdAndDelete(_id);
        if(!document){
            return next(ErrorHandlerService.notFound());
        }
        return res.status(204).json({message : "Almirah Deleted Successfully ! "});
    } catch (error) {
        next(error);
    }
  }
}

module.exports = new AlmirahController();
