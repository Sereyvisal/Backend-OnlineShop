import moment from "moment";
import mongoose from "mongoose";
import Inventory from "./Inventory.js";
import OrderItem from "./OrderItem.js";
import User from "./User.js";

const OrderSchema = mongoose.Schema({
    order_no: {
        type: String,
        required: true
    },
    order_date: {
        type: Date,
        required: true,
        default: moment().format("YYYY/MM/DD")
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: {
        type: Array, // _id: (inventory id), order_qty
        required: true
    },
    payment_method: {
        type: String,
        // required: true
    },
    delivery_address: {
        type: Object,
        required: true
    },
    delivery_fee: {
        type: Number,
        default: 0,
        // required: true
    },
    tax: {
        type: Number,
        default: 0,
        required: true
    },
    status: {
        type: Array,
        default: []
    },
    // attachments: {
    //     type: Array,
    //     default: []
    // },
    remark: {
        type: String,
        default: ""
    }
},
{
    versionKey: false
});

OrderSchema.methods.fillObject = async(obj) => {
    var tempProducts = [];

    for (var p of obj.products) {
        var product = p;
        p = await Inventory.findById(p._id);
        p = await p.fillObject(p)

        p.order_qty = product.order_qty;
        tempProducts.push(p);
    }
    
    const tempCustomer = await User.findById(obj.customer);

    const temp = {
        _id: obj._id,
        order_no: obj.order_no,
        order_date: obj.order_date,
        customer: tempCustomer,
        products: tempProducts,
        payment_method: obj.payment_method,
        delivery_address: obj.delivery_address,
        delivery_fee: obj.delivery_fee,
        tax: obj.tax,
        status: obj.status,
        // attachments: obj.attachments,
        remark: obj.remark
    }

    return temp;
}

export default mongoose.model("order", OrderSchema, "order")