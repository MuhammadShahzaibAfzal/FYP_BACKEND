const authControllers = require("../controllers/auth-controllers");
const authMiddleware = require("../middlewares/auth-middleware");

const authRouter = require("express").Router();

authRouter.post("/login/",authControllers.login);
authRouter.get("/logout/",authMiddleware,authControllers.logout);  // only authenticated user logout
authRouter.post("/change-password/",authMiddleware,authControllers.changePassword);  // only authenticated user change password.
authRouter.get("/refresh-tokens/",authControllers.refreshToken);
authRouter.post("/forget-password/",authControllers.forgetPassword);
authRouter.post("/reset-password/",authControllers.resetPassword);
module.exports = authRouter;