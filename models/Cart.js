import mongoose from "mongoose";
import moment from "moment";
import ProductItem from "./ProductItem.js";
import Product from "./Product.js";
import Category from "./Category.js";
import Inventory from "./Inventory.js";

const CartSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: {
        type: Array,
        default: []
    },

},
{
    versionKey: false
})

CartSchema.methods.fillObject = async (obj) => {
    var tempProducts = [];

    for (var p of obj.products) {
        var tempProductItem = await ProductItem.findById(p.product);
        tempProductItem.product_id = await Product.findById(tempProductItem.product_id);
        tempProductItem.product_id.category = await Category.findById(tempProductItem.product_id.category);

        // var inventory = await Inventory.findOne({ product_info_id: tempProductItem._id });
        // console.log("inventory: ", inventory);
        // if (inventory) {
        //     tempProductItem.stock_qty = inventory.qty;
        // }
        // else {
        //     tempProductItem.stock_qty = 0;
        // }

        // console.log('\n\ntempProductItem: ', tempProductItem);

        tempProducts.push({product: tempProductItem, cart_qty: p.cart_qty});
    }

    return {
        _id: obj._id,
        customer: obj.customer,
        products: tempProducts
    }
}

export default mongoose.model("cart", CartSchema, "cart");