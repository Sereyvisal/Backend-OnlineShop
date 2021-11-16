import moment from "moment";
import mongoose from "mongoose"
import Category from "../models/Category.js";
import Inventory from "./Inventory.js";
import ProductItem from "./ProductItem.js";

const ProductSchema = mongoose.Schema(
    {
        product_no: {
            type: String,
            required: true,
            // unique: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category',
            required: true
        },
        image: {
            type: Array,
            default: []
        },
        remark: {
            type: String,
            default: null
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        is_in_use: {
            type: Boolean,
            default: false
        },
        attr_type: {
            type: Array,
            default: [],
            set: v => v || []
        },
        attr_value: {
            type: Array,
            default: [],
            set: v => v || []
        },
        create_date: {
            type: Date,
            required: true,
            default: moment().format("YYYY/MM/DD")
        },
    },
    {
        versionKey: false
    }
);

ProductSchema.methods.fillObject = async (obj) => {
    const tempProductItems = await ProductItem.find({ product_id: obj._id}, { product_id: 0 }).sort('selling_price')
    return {
        _id: obj._id,
        product_no: obj.product_no,
        name: obj.name,
        description: obj.description,
        category: await Category.findById(obj.category),
        image: obj.image,
        remark: obj.remark,
        is_active: obj.is_active,
        is_in_use: obj.is_in_use,
        attr_type: obj.attr_type,
        attr_value: obj.attr_value,
        min_selling_price: tempProductItems[0].selling_price,
        product_items: await ProductItem.find({ product_id: obj._id}, { product_id: 0 }),
        create_date: obj.create_date
    }
}

export default mongoose.model("product", ProductSchema, "product");