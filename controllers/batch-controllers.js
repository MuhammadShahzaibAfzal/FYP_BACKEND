const BatchModel = require("../models/batch-model");
const ErrorHandlerService = require("../services/error-handling-service");

class BatchController {
  async getAll(req, res, next) {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;
    let totalEntries;
    let totalPages;
    // search functionality
    const q = req.query.q || "";
    const regexQuery = new RegExp(q, "i");
    const filter = { name: { $regex: regexQuery } };
    try {
      const documents = await BatchModel.find(filter, "-__v")
        .skip(skip)
        .limit(limit);
      totalEntries = await BatchModel.countDocuments(filter);
      totalPages = Math.ceil(totalEntries / limit);
      return res
        .status(200)
        .json({ data: documents, totalEntries, totalPages });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    const { name, startDate, endDate } = req.body;
    // validate request
    if (!name || !startDate || !endDate) {
      return next(ErrorHandlerService.validationError());
    }
    try {
      // check batch name already exist ? unique name allowed only
      const isExist = await BatchModel.findOne({ name });
      if (isExist) {
        return next(ErrorHandlerService.alreadyExist());
      }
      // save into db
      const document = await BatchModel.create({
        name,
        startDate,
        endDate,
      });
      return res.status(201).json(document);
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    const { _id } = req.params;
    try {
      const document = await BatchModel.findById(_id, "-__v");
      if (!document) {
        return next(ErrorHandlerService.notFound());
      }
      return res.status(200).json(document);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    const {_id} = req.params;
    const { startDate, endDate } = req.body;
    // validate request
    if (!startDate || !endDate) {
      return next(ErrorHandlerService.validationError());
    }
    try {
        const document = await BatchModel.findByIdAndUpdate(_id,{startDate,endDate},{new:true});
        if (!document) {
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
      const document = await BatchModel.findByIdAndDelete(_id);
      if (!document) {
        return next(ErrorHandlerService.notFound());
      }
      return res.status(204).json(document);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BatchController();
