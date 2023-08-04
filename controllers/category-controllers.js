const ErrorHandlerService = require("../services/error-handling-service");
const CategoryModel = require("../models/category-model");
const deleteImage = require("../services/delete-image-service");
const handleMultipartData = require("../services/multer-config-service");

class CategoryController {
  async getAll(req, res, next) {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;
    let totalPages;
    let totalRecords;
    let categories;
    // searching query
    const q = req.query.q || "";
    const regexQuery = new RegExp(q, "i");
    const filter = { name: { $regex: regexQuery } };
    try {
      categories = await CategoryModel.find(filter, "-__v")
        .skip(skip)
        .limit(limit);
      totalRecords = await CategoryModel.countDocuments(filter);
      totalPages = Math.ceil(totalRecords / limit);
    } catch (error) {
      return next(error);
    }
    return res.status(200).json({ categories, totalPages, totalRecords });
  }

  async create(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }
      let document;
      const filePath = req.file.path;
      const { name, description } = req.body;
      try {
        // request validation
        if (!name || !description) {
          // delete uploaded image becoz validation failed
          deleteImage(filePath);
          return next(ErrorHandlerService.validationError());
        }
        // check category name already exists ? it must be unique
        const isExist = await CategoryModel.findOne({ name });
        if (isExist) {
          // remove uploaded file first
          deleteImage(filePath);
          return next(ErrorHandlerService.alreadyExist());
        }
        //   save into db
        document = await CategoryModel.create({
          name,
          description,
          imagePath: filePath,
        });
        return res.status(201).json(document);
      } catch (error) {
        return next(error);
      }
    });
  }

  async get(req, res, next) {
    const _id = req.params._id;
    let category;
    try {
      category = await CategoryModel.findById(_id, "-__v");
      if (!category) {
        return next(ErrorHandlerService.notFound());
      }
    } catch (error) {
      return next(error);
    }
    return res.status(200).json(category);
  }

  async update(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }
      const filePath = req.file.path;
      const { description } = req.body;
      const _id = req.params._id;
      try {
        // request validation
        if (!description) {
          // delete uploaded image becoz validation failed
          deleteImage(filePath);
          return next(ErrorHandlerService.validationError());
        }

        // update image means delete previous one...
        const document = await CategoryModel.findById(_id);
        if (!document) {
          // if there is no category of that id then simple delete currently uploaded file
          deleteImage(filePath);
          return next(ErrorHandlerService.notFound());
        }

        // delete previous image and add new image path into db
        deleteImage(document.imagePath);

        document.imagePath = filePath;
        document.description = description;
        await document.save();
        return res.status(200).json({ document });
      } catch (error) {
        return next(error);
      }
    });
  }

  async delete(req, res, next) {
    const _id = req.params._id;
    try {
      const document = await CategoryModel.findByIdAndDelete(_id);
      if (!document) {
        return next(ErrorHandlerService.notFound());
      }
      // delete image of that category also
      deleteImage(document.imagePath);
      return res.status(204).json({ message: "Category deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
