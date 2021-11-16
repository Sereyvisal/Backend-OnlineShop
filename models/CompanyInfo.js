import mongoose from "mongoose";

const CompanyInfoSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    open_hour: {
        type: String,
        required: true
    }
},
    {
        versionKey: false
    });

export default mongoose.model("companyinfo", CompanyInfoSchema, "companyinfo");