"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const schema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: [true, "Please Enter ID"],
    },
    name: {
        type: String,
        required: [true, "Please Enter Name"],
    },
    email: {
        type: String,
        unique: [true, "Email already exist"],
        required: [true, "Please Enter Email"],
        validate: validator_1.default.default.isEmail,
    },
    dob: {
        type: Date,
        required: [true, "Please Enter Date of Birth"],
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please Enter Gender"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        required: [true, "Please Enter Role"],
    },
    photo: {
        type: String,
        required: [true, "Please Enter Photo"],
    },
}, {
    timestamps: true,
});
schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
exports.User = mongoose_1.default.model("User", schema);
