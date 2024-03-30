"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"],
        minLength: [3, "Name is Invalid"],
        trim: true
    },
    email: {
        type: String,
        unique: [true, "Email already exist"],
        required: [true, "Please Enter Email"],
        validate: validator_1.default.default.isEmail,
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"],
        validate: {
            validator: validator_1.default.default.isStrongPassword,
            message: "Password must be strong"
        }
    },
    dob: {
        type: Date,
        required: [true, "Please Enter Date of Birth"],
    },
    age: {
        type: Number
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
        default: "user"
    },
    photo: {
        type: String,
        required: [true, "Please Enter Photo"],
    },
    token: {
        type: String,
        unique: true
    }
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model("User", schema);
