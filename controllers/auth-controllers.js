const emailService = require("../services/email-service");
const ErrorHandlerService = require("../services/error-handling-service");
const tokenService = require("../services/token-service");
const userService = require("../services/user-service");
const bcrypt = require("bcrypt");

class AuthController {
  async login(req, res, next) {
    const { email, password } = req.body;
    // request validation
    if (!email || !password) {
      return next(ErrorHandlerService.validationError());
    }
    // check user exists or not ?
    let user;
    try {
      user = await userService.getUser({ email });
      if (!user) {
        return next(ErrorHandlerService.wrongCredentials());
      }
    } catch (error) {
      next(error);
    }
    // compare password : correct or not?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(ErrorHandlerService.wrongCredentials());
    }

    // genrate tokens
    const { accessToken, refreshToken } = await tokenService.genrateTokens({
      _id: user._id,
      role: user.role,
    });

    // save refresh token into db or update previous refresh token of user....
    try {
      const isExist = await tokenService.findRefreshToken({ user: user._id });
      if (isExist) {
        // if exist then update refresh token
        await tokenService.updateRefreshToken(
          { user: user._id },
          { token: refreshToken }
        );
      } else {
        // if  not exsit then save it
        await tokenService.saveRefreshToken({
          user: user._id,
          token: refreshToken,
        });
      }
    } catch (error) {
      return next(error);
    }

    // set cookies....
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    return res.status(200).json({ isAuth: true, user: user });
  }

  async logout(req, res, next) {
    // get refresh token from cookie
    const { refreshToken } = req.cookies;
    // remove refresh token from db
    try {
      await tokenService.removeRefreshToken({token:refreshToken});
    } catch (error) {
      return next(error);
    }
    // delete cookies
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.json({
      user: null,
      isAuth: false,
    });
  }

  async refreshToken(req, res, next) {
    // get refresh token from cookies
    const { refreshToken: refreshTokenFromCookie } = req.cookies;

    // verify refresh token
    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
    } catch (error) {
      return next(ErrorHandlerService.unAuthorized());
    }
    
    try {
      // check if token is in db
      const token = await tokenService.findRefreshToken({
        user: userData._id,
        token: refreshTokenFromCookie,
      });
      if (!token) {
        return next(ErrorHandlerService.unAuthorized('No token found !'));
      }

      // check user exist or not
      const userExist = await userService.getUser({ _id: userData._id });
      if (!userExist) {
        return next(ErrorHandlerService.unAuthorized('No user found!'));
      }``

       // genrate new tokens
       const { refreshToken, accessToken } = await tokenService.genrateTokens({
        _id: userData._id,
        role: userData.role,
      });
      // update refresh token into db
      await tokenService.updateRefreshToken({user:userData._id}, {token:refreshToken});
      // set cookies
      res.cookie("accessToken", accessToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
      });
      // retrun response
      return res.status(200).json({
        user: userExist,
        isAuth: true,
      });
    } catch (error) {
        next(error);
    }
  }

  async changePassword(req, res, next) {
    const {currentPassword,newPassword} = req.body;
    // request validation
    if(!currentPassword || !newPassword){
       return next(ErrorHandlerService.validationError());
    }

    try {
      // check users exit or not
      const user = await userService.getUser({ _id: req.userData._id });
      if (!user) {
        return next(ErrorHandlerService.notFound());
      }
      // confirm current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return next(ErrorHandlerService.wrongCredentials());
      }
      // hash new password before saving into db
      const hashedPassowrd = await bcrypt.hash(newPassword,10);
      // change password
      await userService.updateUser(user._id, { password: hashedPassowrd });

      return res.status(200).json({ msg: "Password Changed Successfully !" });
    } catch (error) {
      next(error);
    }

}

  async forgetPassword(req, res, next) {
    const { email } = req.body;
    // validate request
    if (!email) {
      return next(ErrorHandlerService.validationError("Email is required"));
    }
    try {
      // check email is valid 
      const user = await userService.getUser({ email });
      if (!user) {
        return next(ErrorHandlerService.notFound());
      }
      // genrate password reset token
      const resetToken = await tokenService.genratePasswordResetToke({_id:user._id});

      // store password reset token into db
      user.resetToken = resetToken;
      await user.save();

      // send email
      await emailService.sendPasswordResetEmail(user.email,resetToken);
      return res.status(200).json({msg:"Email send...."})
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req,res,next){
      const {newPassword,token} = req.body;
      // request validation
      if(!newPassword || !token){
        return next(ErrorHandlerService.validationError());
      }
      // check token valid or not
      let userData;
      try {
          userData = await tokenService.verifyPasswordResetToken(token);
      } catch (error) {
          return next(ErrorHandlerService.badRequest('Invalid or expire token !'));
      }

      try {
        // find user
      const user = await userService.getUser({
        _id: userData._id,
        resetToken: token,
      });
      if (!user) {
        return next(ErrorHandlerService.badRequest('User Not Found !'));
      }

      // hashed password before save
      const hashedPassowrd = await bcrypt.hash(newPassword,10);
      user.password = hashedPassowrd;
      user.resetToken = undefined;
      await user.save();
      return res.status(200).json({msg:'Password reset successfully !'})
      } catch (error) {
        next(error);
      }
  }
}

module.exports = new AuthController();
