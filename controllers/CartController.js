import Cart from "../models/Cart.js";
import { meta } from "../utils/enum.js";
import * as msg from "../utils/message.js";
import mongoose from "mongoose";

export async function listCart(req, res) {
    try {
        let carts, totalCount;

        carts = await Cart.find().sort([[ "_id", -1]]);

        totalCount = await Cart.find().countDocuments();
    
        Promise.all(carts.map(async(p) => await p.fillObject(p)))
        .then(p => {
            res.status(200).json({ meta: meta.OK, datas: p, total: totalCount });
        })
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function getCart(req, res) {
    try {
        const cart = await Cart.findById(req.params.id);
        const result = await cart.fillObject(cart);

        if(cart == null){
            res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
        }
        else{
            res.status(200).json({ meta: meta.OK, data: result });
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function getCartByCustomerId(req, res) {
    try {
        const cart = await Cart.findOne({ customer: req.params.id });
        
        if(cart == null){
            res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
        }
        else {
            const result = await cart.fillObject(cart);
            res.status(200).json({ meta: meta.OK, data: result });
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function upsertCart(req, res) {
    try {
        const cart = await Cart.findOne({ customer: req.body.customer });

        if (cart) {
            const cartData = await cart.fillObject(cart);
            var checkExistProduct = false;
            var cartProducts = [];
            var updateData = null;

            for (var p of cartData.products) {
                if (p.product._id == req.body.product._id) {
                    p.cart_qty += req.body.product.cart_qty;
                    checkExistProduct = true;
                }

                cartProducts.push({product: p.product._id.toString(), cart_qty: p.cart_qty});
            }

            // var existProduct = cartData.products.find(e => e._id == req.body.product._id);

            // if (existProduct) {

            // }

            if (!checkExistProduct) {
                cartProducts.push({product: req.body.product._id, cart_qty: req.body.product.cart_qty});
                // updateData = {
                //     customer: req.body.customer,
                //     products: []
                // };
            }
            // else {
                updateData = new Cart({
                    _id: cartData._id,
                    customer: req.body.customer,
                    products: cartProducts
                });
            // }

            await Cart.findByIdAndUpdate({ _id: cartData._id }, updateData, async (err, data) => {
                if (err) {
                    res.status(404).json({ meta: meta.ERROR, message: err.message });
                    return true;
                }

                if (data != null) {
                    const result = await updateData.fillObject(updateData);
                    res.status(200).json({ meta: meta.OK, data: result, message: msg.messages.record_update });
                }
                else {
                    res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
                }
            });
        }
        else {
            const upsertData = new Cart({
                customer: req.body.customer,
                products: [{product: req.body.product._id, cart_qty: req.body.product.cart_qty}]
            });

            upsertData.save().then(async data => {
                data = new Cart(data);
                const result = await data.fillObject(data);
                res.status(200).json({ meta: meta.OK, data: result, message: msg.messages.record_add });
            })
            .catch(err => {
                res.status(404).json({ meta: meta.ERROR, message: err.message });
            });
        }

        // if (req.body._id === undefined || req.body._id == "") {
        //     delete req.body.id;

        //     const cart = new Cart(req.body);

        //     cart.save()
        //         .then(data => {
        //             res.status(200).json({ meta: meta.OK, message: msg.messages.record_add });
        //         })
        //         .catch(err => {
        //             res.status(404).json({ meta: meta.ERROR, message: err.message });
        //         });
        // }
        // else {
        //     await Cart.findByIdAndUpdate({ _id: req.body.id }, req.body, (err, data) => {
        //         if (err) {
        //             res.status(404).json({ meta: meta.ERROR, message: err.message });
        //             return true;
        //         }

        //         if (data != null) {
        //             res.status(200).json({ meta: meta.OK, message: msg.messages.record_update });
        //         }
        //         else {
        //             res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
        //         }
        //     });
        // }


        // if (!req.body._id) req.body._id = new mongoose.mongo.ObjectID();

        // Cart.findOneAndUpdate({ _id: req.body._id }, req.body, { upsert: true }, (err, data) => {
        //     if (err) {
        //         res.status(200).json({ meta: meta.ERROR, message: err.message });
        //         return;
        //     }
            
        //     res.status(200).json({ meta: meta.OK, data: data, message: msg.messages.record_update });
        // });
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function updateCartQty(req, res) {
    try {
        var tempProducts = [];

        for (var p of req.body.products) {
            tempProducts.push({product: p.product._id, cart_qty: p.cart_qty});
        }

        var updateData = new Cart({
            _id: req.body._id,
            customer: req.body.customer,
            products: tempProducts
        });

        await Cart.findByIdAndUpdate({ _id: req.body._id }, updateData, async (err, data) => {
            if (err) {
                res.status(404).json({ meta: meta.ERROR, message: err.message });
                return true;
            }

            if (data != null) {
                const result = await updateData.fillObject(updateData);
                res.status(200).json({ meta: meta.OK, data: result, message: msg.messages.record_update });
            }
            else {
                res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
            }
        });
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function deleteCart(req, res) {
    try {
        Cart.findByIdAndDelete(req.params.id, (err, data) => {
            if (err) {
                res.status(404).json({ meta: meta.ERROR, message: err.message });
                return true;
            }

            if (data != null) {
                res.status(200).json({ meta: meta.OK, message: msg.messages.record_delete });
            }
            else {
                res.status(404).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
            }
        });
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}