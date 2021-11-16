import mongoose from "mongoose";

const OrderItemSchema = mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
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
    }
},
{
    versionKey: false
});

OrderItemSchema.methods.fillObject = async(obj) => {
    const temp = {
        _id: obj._id,
        order_id: obj.order_id,
        inventory: await obj.inventory.fillObject(obj.inventory),
        qty: obj.qty
    };

    return temp;
}

export default mongoose.model("orderitem", OrderItemSchema, "orderitem")