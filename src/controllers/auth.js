const jwt = require('jsonwebtoken');
const User = require('../models/users');
const bcrypt = require('bcrypt');

async function signup(req, res) {
    try {
        const { userName, email, phone, password } = req.body;
        const checkUser = await User.findOne({email: email}, {_id: 1});
        if (checkUser)
            throw new Error('User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            userName: userName,
            email: email,
            phone: phone,
            password: hashedPassword
        });

        await user.save();
        const payload = {
            id: user._id
        }

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "3d"
        });

        res.status(200).header('token', token).json(user);
    } catch(error) {
        res.status(401).json(error.message);
    }
}

async function signin(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email: email});

        if (!user)
            throw new Error('Bad credentials');

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword)
            throw new Error('Bad credentials');

        const payload = {
            id: user._id
        }

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "3d"
        });

        res.status(200).header('token', token).json(user);
    } catch(error) {
        console.log(error);
        res.status(401).json(error.message);
    }
}

module.exports = {
    signup,
    signin
}