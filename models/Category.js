import mongoose from "mongoose";
import moment from "moment";

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ""
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    recommend: {
        type: Boolean,
        default: false
    }
},
{
    versionKey: false
})

CategorySchema.methods.fillObject = (obj) => {
    return {
        _id: obj._id,
        name: obj.name,
        avatar: obj.avatar,
        parent: obj.parent,
        recommend : obj.recommend
    }
}

CategorySchema.methods.getParent = async (id) => {
    return mongoose.model('category').find({ parent: id }).exec((err, data) => {
        return data;
    })
}

export default mongoose.model("category", CategorySchema, "category");