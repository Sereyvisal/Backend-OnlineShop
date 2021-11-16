import mongoose from "mongoose";
import moment from "moment";
import Role from "./Role.js";

//DB Model
const UserProfileSchema = mongoose.Schema({
    avatar: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true
    },
    birthday: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        default: moment().format("MM-DD-YYYY"),
        required: true,
    },
    // login_ip: {
    //     type: String,
    //     default: null,
    // },
    login_time: {
        type: String,
        default: null,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role',
        // required: true
    },
    address: {
        type: Array
    },
    phone_number: {
        type: String
    }
}, {
    versionKey: false
})

UserProfileSchema.methods.fillObject = async (obj) => {
    const role = await Role.findById(obj.role);
    
    return {
        _id: obj._id,
        avatar: obj.avatar,
        email: obj.email,
        firstname: obj.firstname,
        lastname: obj.lastname,
        gender: obj.gender,
        birthday: obj.birthday,
        role: role,
        // login_ip: obj.login_ip,
        login_time: obj.login_time,
        password: obj.password,
        address: obj.address,
        phone_number: obj.phone_number
    }
}

UserProfileSchema.methods.payload = async (obj) => {
    return {
        email: obj.email,
        _id: obj._id,
        role: obj.role
    }
}

export default mongoose.model("user", UserProfileSchema, "user");