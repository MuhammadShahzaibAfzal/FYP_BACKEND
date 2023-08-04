const BookModel = require("../models/book-model");
const deleteImage = require("../services/delete-image-service");
const ErrorHandlerService = require("../services/error-handling-service");
const handleMultipartData = require("../services/multer-config-service");

class BookController {
  async getAll(req, res, next) {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;
    let totalEntries;
    let totalPages;

    // Search by ISBN, Title , Category , Almirah , Status
    const regexQueryISBN = new RegExp(req.query.qISBN || "", "i");
    const regexQueryTitle = new RegExp(req.query.qTitle || "", "i");
    const regexQueryStatus = new RegExp(req.query.qStatus || "", "i");
    const filter = [
      { ISBN: { $regex: regexQueryISBN } },
      { title: { $regex: regexQueryTitle } },
      { status: { $regex: regexQueryStatus } },
    ];
    try {
      const documents = await BookModel.find({ $and: filter }, "-__v")
        .populate("category", "-__v -createdAt -updatedAt")
        .populate("almirah", "-__v -createdAt -updatedAt")
        .skip(skip)
        .limit(limit);
      totalEntries = await BookModel.countDocuments({ $and: filter });
      totalPages = Math.ceil(totalEntries / limit);
      return res
        .status(200)
        .json({ data: documents, totalEntries, totalPages });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }
      const filePath = req.file.path;
      const {
        ISBN,
        title,
        author,
        category,
        almirah,
        shelf,
        publisher,
        description,
        edition,
        tags,
      } = req.body;
      try {
        // validate request
        if (!ISBN || !title || !author || !category || !almirah) {
          // if validatin failed then delete uploaded image also
          deleteImage(filePath);
          return next(ErrorHandlerService.validationError());
        }
        // Check ISBN already have ? allow unique ISBN
        const isExist = await BookModel.findOne({ ISBN });
        if (isExist) {
          deleteImage(filePath);
          return next(
            ErrorHandlerService.alreadyExist(
              "ISBN already taken. Only unique ISBN allow"
            )
          );
        }

        // save into db..
        const document = await BookModel.create({
          ISBN,
          title,
          author,
          category,
          almirah,
          imagePath: filePath,
          publisher,
          description,
          edition,
          tags,
          shelf,
        });

        return res.status(201).json(document);
      } catch (error) {
        next(error);
      }
    });
  }

  async get(req, res, next) {
    const { _id } = req.params;
    try {
      const document = await BookModel.findById(_id, "-__v")
        .populate("category")
        .populate("almirah");
      if (!document) {
        return next(ErrorHandlerService.notFound());
      }
      return res.status(200).json(document);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    handleMultipartData(req, res,async(err) => {
      if (err) {
        return next(err);
      }
      const filePath = req.file.path;
      const {_id} = req.params;
      // validate request
      const {
        title,
        author,
        category,
        almirah,
        shelf,
        publisher,
        description,
        edition,
        tags,
        status
      } = req.body;
      try {
        if (!title || !author || !category || !almirah) {
            // if validatin failed then delete uploaded image also
            deleteImage(filePath);
            return next(ErrorHandlerService.validationError());
          }
        //   get books by given id
        const document = await BookModel.findById(_id);
        if(!document){
            // if book not have of that id then delete currently uploaded file
            deleteImage(filePath);
        }
        // update image and delete previous image
        deleteImage(document.imagePath);

        document.title = title;
        document.author = author;
        document.category = category;
        document.almirah = almirah;
        document.shelf = shelf;
        document.publisher = publisher;
        document.edition = edition;
        document.description = description;
        document.tags = tags;
        document.status = status;
        await document.save();

        return res.status(200).json(document);
      } catch (error) {
            next(error);
      }
    });
  }

  async delete(req, res, next) {
    const { _id } = req.params;
    try {
      const document = await BookModel.findByIdAndDelete(_id);
      if (!document) {
        return next(ErrorHandlerService.notFound());
      }
      return res.status(204).json({ message: "Book Deleted Successfull" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookController();
