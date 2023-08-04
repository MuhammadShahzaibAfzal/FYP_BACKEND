const UserModel = require("../models/user-model");

class UserService{
    async getUsers(filter){
        return await UserModel.find(filter);
    }

    async getUser(filter){
        return await UserModel.findOne(filter,"-__v");
    }

    async saveUser(data){
        return await UserModel.create(data);
    }

    async updateUser(id,data){
        return await UserModel.findByIdAndUpdate(id,data);
      }
}

module.exports = new UserService();