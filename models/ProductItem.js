import mongoose from "mongoose";
import Product from "../models/Product.js";

const ProductItemSchema = mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        cost_price: {
            type: Number,
            required: true
        },
        selling_price: {
            type: Number,
            required: true
        },
        image: {
            type: Array,
            default: []
        },
        attr: {
            type: Object,
            required: true
        },
        is_active: {
            type: Boolean,
            default: true,
        }
    },
    {
        versionKey: false
    }
);

ProductItemSchema.methods.fillObject = async (obj) => {
    return {
        _id: obj._id,
        main_product_info: await Product.findById(obj.product_id).select("-attr_type -attr_value -is_active"),
        selling_price: obj.selling_price,
        cost_price: obj.cost_price,
        image: obj.image,
        attr: obj.attr,
        is_active: obj.is_active
    };
};

ProductItemSchema.methods.fillObjectInvoice = async function () {

};

export default mongoose.model("product_item", ProductItemSchema, "product_item");