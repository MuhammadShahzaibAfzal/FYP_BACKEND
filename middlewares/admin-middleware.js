const ErrorHandlerService = require("../services/error-handling-service");

const adminMiddleware = async (req,res,next) => {
    console.log('admin middleware run');
    const role = req.userData.role;
    console.log(role);
    if(role === "Admin"){
        return next();
    }
    else{
        next(ErrorHandlerService.forbidden());
    }
}

module.exports = adminMiddleware;