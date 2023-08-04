const categoryController = require("../controllers/category-controllers");
const adminMiddleware = require("../middlewares/admin-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

const categoryRouter = require("express").Router();

categoryRouter.get("/",categoryController.getAll);
categoryRouter.get("/:_id",categoryController.get);
// authenticated routes... only admin allow
categoryRouter.post("/",authMiddleware,adminMiddleware,categoryController.create);
categoryRouter.put("/:_id",authMiddleware,adminMiddleware,categoryController.update);
categoryRouter.delete("/:_id",authMiddleware,adminMiddleware,categoryController.delete);

module.exports = categoryRouter;