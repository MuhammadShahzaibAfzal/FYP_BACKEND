const almirahControllers = require("../controllers/almirah-controllers");

const almirahRouter = require("express").Router();

almirahRouter.get("/",almirahControllers.getAll);
almirahRouter.post("/",almirahControllers.create);
almirahRouter.get("/:_id",almirahControllers.get);
almirahRouter.put("/:_id",almirahControllers.update);
almirahRouter.delete("/:_id",almirahControllers.delete);

module.exports = almirahRouter;