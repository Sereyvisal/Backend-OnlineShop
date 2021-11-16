import mongoose from "mongoose";

const RoleSchema = mongoose.Schema({
    role_name: {
        type: String,
        required: true
    },
    role_id: {
        type: Number,
        required: true
    },
},
{
    versionKey: false
})

export default mongoose.model("role", RoleSchema, "role");