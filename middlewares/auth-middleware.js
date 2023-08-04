const ErrorHandlerService = require("../services/error-handling-service");
const tokenService = require("../services/token-service");

const authMiddleware = async (req, res, next) => {
    console.log('auth middleware run');
  const { accessToken } = req.cookies;
  try {
    if (!accessToken) {
      throw new Error();
    }
    // validate/verify access token
    const userData = await tokenService.verifyAccessToken(accessToken);

    if (!userData) {
      throw new Error();
    }
    
    req.userData = userData;
    next();
  } catch (error) {
     next(ErrorHandlerService.unAuthorized());
  }
};

module.exports = authMiddleware;
