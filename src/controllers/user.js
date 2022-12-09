const User = require('../models/users');
const ObjectId = require("mongoose").Types.ObjectId;
const bcrypt = require('bcrypt');
const { uploadFile } = require("../config/firebase");

async function uploadProfilePicture(req, res) {
    try {
        if (!req.file) {
            throw new Error('Picture not found');
        }

        const filename = 'Users/'+req.user.id;
        const link = await uploadFile(req.file.path, filename);

        await User.updateOne({_id: ObjectId(req.user.id)}, {$set: {picture: link}});
        res.status(200).send({response: link});
    } catch(error) {
        res.status(401).json(error.message);
    }
}

async function getProfile(req, res) {
    try {
        const user = await User.findById(ObjectId(req.user.id), {__v: 0, password: 0});
        res.status(200).send(user);
    } catch(error) {
        res.status(401).json(error.message);
    }
}

async function updateProfile(req, res) {
    try {
        let updateObj = req.body;

        if (updateObj.password) {
            const user_pass = await User.findById(ObjectId(req.user.id), {password: 1});
            const checkPassword = await bcrypt.compare(updateObj.old_password, user_pass.password);
            if (!checkPassword)
                throw new Error('Bad credentials');
            delete updateObj['old_password'];
            updateObj.password = await bcrypt.hash(updateObj.password, 10);
        }

        const user = await User.updateOne({_id: ObjectId(req.user.id)}, updateObj);
        res.status(200).send(user);
    } catch(error) {
        res.status(401).json(error.message);
    }
}

module.exports = {
    uploadProfilePicture,
    updateProfile,
    getProfile,
}