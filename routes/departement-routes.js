const departementControllers = require("../controllers/departement-controllers");

const departmentRouter = require("express").Router();

departmentRouter.get("/",departementControllers.getAll);
departmentRouter.post("/",departementControllers.create);
departmentRouter.get("/:_id/",departementControllers.get);
departmentRouter.put("/:_id/",departementControllers.update);
departmentRouter.delete("/:_id/",departementControllers.delete);

module.exports = departmentRouter;