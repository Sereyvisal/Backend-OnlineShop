import mongoose from "mongoose";
import ProductItem from "../models/ProductItem.js"
import Category from "./Category.js";
import Product from "./Product.js";

const InventorySchema = mongoose.Schema({
    product_info_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product_item',
        required: true
    },
    qty: {
        type: Number,
        required: true,
        default: 0
    },
},
    {
        versionKey: false
    });

InventorySchema.methods.fillObject = async (obj) => {
    const tempProductItem = await ProductItem.findById(obj.product_info_id);
    tempProductItem.product_id = await Product.findById(tempProductItem.product_id);
    tempProductItem.product_id.category = await Category.findById(tempProductItem.product_id.category);

    const temp = {
        _id: obj._id,
        product_info: tempProductItem,
        qty: obj.qty,
    };

    return temp;
}

export default mongoose.model("inventory", InventorySchema, "inventory");