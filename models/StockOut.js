import mongoose from "mongoose";
import moment from "moment";
import Inventory from "./Inventory.js";
import { stock_out_type } from "../utils/enum.js";

const StockOutSchema = mongoose.Schema({
    stock_out_date: {
        type: Date,
        default: moment().format("MM-DD-YYYY hh:mm A"),
        required: true
    },
    products: {
        type: Array,
        required: true
    },
    type: {
        type: Number,
        default: 1, // stock_out_type.ManualStockOut
        required: true
    },
    remark: {
        type: "String",
        default: null
    },
    attachments: {
        type: Array,
        default: null,
    }
},
{
    versionKey: false
});

StockOutSchema.methods.fillObject = async (obj) => {
    var tempProducts = [];

    for (var p of obj.products) {
        var product = p;
        p = await Inventory.findById(p._id);
        p = await p.fillObject(p)

        p.stock_out_qty = product.stock_out_qty;
        tempProducts.push(p);
    }

    const temp = {
        _id: obj._id,
        stock_out_date: obj.stock_out_date,
        products: tempProducts,
        type: obj.type,
        remark: obj.remark,
        attachments: obj.attachments
    };

    return temp;
}

export default mongoose.model("stock_out", StockOutSchema, "stock_out");