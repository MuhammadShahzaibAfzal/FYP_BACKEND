const batchControllers = require("../controllers/batch-controllers");

const batchRouter = require("express").Router();

batchRouter.get("/",batchControllers.getAll);
batchRouter.post("/",batchControllers.create);
batchRouter.get("/:_id/",batchControllers.get);
batchRouter.put("/:_id/",batchControllers.update);
batchRouter.delete("/:_id/",batchControllers.delete);

module.exports = batchRouter;