const studentControllers = require("../controllers/student-controllers");
const adminMiddleware = require("../middlewares/admin-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

const studentRouter = require("express").Router();

studentRouter.get("/",studentControllers.getAll);
studentRouter.get("/:_id/",studentControllers.get);

// protected routes : only admin allow
studentRouter.post("/",authMiddleware,adminMiddleware,studentControllers.create);
studentRouter.put("/:_id/",authMiddleware,adminMiddleware,studentControllers.update);
studentRouter.delete("/:_id/",authMiddleware,adminMiddleware,studentControllers.delete);

module.exports = studentRouter;