const teacherControllers = require("../controllers/teacher-controllers");
const adminMiddleware = require("../middlewares/admin-middleware");
const authMiddleware = require("../middlewares/auth-middleware");
const teacherRouter = require("express").Router();

teacherRouter.get("/:_id/",teacherControllers.get);

// protected routes...
teacherRouter.get("/",authMiddleware,adminMiddleware,teacherControllers.getAll);
teacherRouter.post("/",authMiddleware,adminMiddleware,teacherControllers.create);
teacherRouter.put("/:_id/",authMiddleware,adminMiddleware,teacherControllers.update);
teacherRouter.delete("/:_id/",authMiddleware,adminMiddleware,teacherControllers.delete);

module.exports = teacherRouter;