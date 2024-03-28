"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const user_1 = require("../models/user");
const createUser = async (req, res, next) => {
    try {
        const { name, email, dob, gender, photo, _id, role } = req.body;
        const user = await user_1.User.create({
            _id,
            name,
            email,
            dob: new Date(dob),
            gender,
            photo,
            role
        });
        return res.status(201).json({
            success: true,
            message: `User Created Successfully`,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: `Error: ${error}`,
        });
    }
};
exports.createUser = createUser;
