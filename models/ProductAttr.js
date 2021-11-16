import mongoose from "mongoose";

const ProductAttrSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
   
}, {
    versionKey: false
})

// ProductAttrSchema.methods.fillObject = (obj) => {
//     return {
//         _id: obj._id,
//         name: obj.name,
//     }
// }

export default mongoose.model("productAttr", ProductAttrSchema, "productAttr");