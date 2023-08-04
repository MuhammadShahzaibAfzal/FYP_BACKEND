const jsonwebtoken = require("jsonwebtoken");
const RefreshTokenModel = require("../models/refresh-token-model");


class TokenService {
    async genrateTokens(payload){
        const accessToken = jsonwebtoken.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'2m'});
        const refreshToken = jsonwebtoken.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1h'});
        return {accessToken,refreshToken};
    }

    async findRefreshToken(filter){
        return await RefreshTokenModel.findOne(filter);
    }

    async saveRefreshToken(data){
        return await RefreshTokenModel.create(data);
    }

    async updateRefreshToken(filter,data){
        return await RefreshTokenModel.updateOne(filter,data);
    }

    async removeRefreshToken(filter){
        return await RefreshTokenModel.deleteOne(filter);
    }

    async verifyAccessToken(token){
        return  jsonwebtoken.verify(token,process.env.ACCESS_TOKEN_SECRET);
    }

    async verifyRefreshToken(token){
        return  jsonwebtoken.verify(token,process.env.REFRESH_TOKEN_SECRET);
    }

    async genratePasswordResetToke(payload){
        return jsonwebtoken.sign(payload,process.env.FORGET_PASSWORD_TOKEN_SECRET,{
            expiresIn : '2m'
        });
    }

    async verifyPasswordResetToken(token){
        return  jsonwebtoken.verify(token,process.env.FORGET_PASSWORD_TOKEN_SECRET);
    }
}

module.exports = new TokenService();