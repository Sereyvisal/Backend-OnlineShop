import mongoose from "mongoose";

const StockInItemSchema = mongoose.Schema({
    stock_in_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stock_in',
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
},
{
    versionKey: false
});

StockInItemSchema.methods.fillObject = async (obj) => {
    const temp = {
        _id: obj._id,
        stock_in_id: obj.stock_in_id,
        inventory: await obj.inventory.fillObject(obj.inventory),
        qty: obj.qty
    };

    return temp;
}

export default mongoose.model("stock_in_item", StockInItemSchema, "stock_in_item");