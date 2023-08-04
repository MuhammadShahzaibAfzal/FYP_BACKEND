const bookControllers = require("../controllers/book-controllers");
const adminMiddleware = require("../middlewares/admin-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

const bookRouter = require("express").Router();

bookRouter.get("/",bookControllers.getAll);
bookRouter.get("/:_id",bookControllers.get);

// protected routes : only admin allow
bookRouter.post("/",authMiddleware,adminMiddleware,bookControllers.create);
bookRouter.put("/:_id",authMiddleware,adminMiddleware,bookControllers.update);
bookRouter.delete("/:_id",authMiddleware,adminMiddleware,bookControllers.delete);

module.exports = bookRouter;