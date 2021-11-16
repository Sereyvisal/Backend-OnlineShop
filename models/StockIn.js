import mongoose from "mongoose";
import moment from "moment";
import StockInItem from "./StockInItem.js";

const StockInSchema = mongoose.Schema({
    stock_in_date: {
        type: Date,
        default: moment().format("MM-DD-YYYY hh:mm A"),
        required: true
    },
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'inventory',
        required: true
    },
    qty: {
        type: Number,
        default: 0,
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

StockInSchema.methods.fillObject = async (obj) => {
    // const tempDetail = await StockInItem.find({ stock_in_id: obj._id }).populate("inventory");

    const temp = {
        _id: obj._id,
        stock_in_date: obj.stock_in_date,
        inventory: await obj.inventory.fillObject(obj.inventory),
        qty: obj.qty,
        remark: obj.remark,
        attachments: obj.attachments,
        // product_item: tempDetail,
    };

    return temp;
}

export default mongoose.model("stock_in", StockInSchema, "stock_in");