import Order from "../models/Order.js";
import { meta, status_type, stock_out_type } from "../utils/enum.js";
import { numberSequence } from "../utils/generalFunc.js"
import * as msg from "../utils/message.js";
import mongoose from "mongoose";
import moment from "moment";
import StockOut from "../models/StockOut.js";
import Inventory from "../models/Inventory.js";

export async function listOrder(req, res) {
    try {
        let orders, totalCount;

        orders = await Order.find().sort([["order_date", -1]]);

        totalCount = await Order.find().countDocuments();

        Promise.all(orders.map(async (p) => await p.fillObject(p)))
            .then(p => {
                res.status(200).json({ meta: meta.OK, datas: p, total: totalCount });
            })
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function getOrderByCustomerId(req, res) {
    try {
        var orders = await Order.find({ customer: req.params.id });

        if (orders == null) {
            res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
        }
        else {
            Promise.all(orders.map(async (p) => await p.fillObject(p)))
                .then(p => {
                    res.status(200).json({ meta: meta.OK, datas: p });
                })
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function getOrder(req, res) {
    try {
        var order = await Order.findById(req.params.id);

        if (order == null) {
            res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
        }
        else {
            order = await order.fillObject(order);

            res.status(200).json({ meta: meta.OK, data: order });
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}


export async function upsertOrder(req, res) {
    try {
        if (req.body._id == undefined || req.body._id == "") {
            req.body.order_date = moment().format("MM-DD-YYYY hh:mm A");

            const order = new Order(req.body);

            order.status = [
                {
                    name: "Pending",
                    date: moment().toDate(),
                    type: status_type.Pending
                }
            ]

            const last_order = await Order.findOne({}, {}, { sort: { '_id': -1 } }, (err, data) => {
                if (err) {
                    res.status(404).json({ meta: meta.ERROR, message: err.message });
                    return true;
                }

                if (data != null) {
                    order.order_no = numberSequence("", parseInt(data.order_no) + 1, 1000000000);
                }
                else {
                    order.order_no = numberSequence("", 1, 1000000000);
                }
            })

            await order.save().then(async data => {
                data = new Order(data);
                const result = await data.fillObject(data);

                res.status(200).json({ meta: meta.OK, data: result, message: msg.messages.record_add });
            })
                .catch(err => {
                    res.status(404).json({ meta: meta.ERROR, message: err.message });
                });
        }
        else {
            await Order.findByIdAndUpdate({ _id: req.body._id }, req.body, async (err, data) => {
                if (err) {
                    res.status(404).json({ meta: meta.ERROR, message: err.message });
                    return true;
                }

                if (data != null) {
                    res.status(200).json({ meta: meta.OK, message: msg.messages.record_update });
                }
            })
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function updateStatus(req, res) {
    try {
        await Order.findByIdAndUpdate({ _id: req.body._id }, { status: req.body.status }, async (err, data) => {
            if (err) {
                res.status(404).json({ meta: meta.ERROR, message: err.message });
                return true;
            }

            if (data != null) {
                // Stock out when deliver
                if (req.body.status[0].type == status_type.Deliver) {
                    // Upsert to stock out
                    var stock_out = new StockOut(
                        {
                            stock_out_date: moment().toDate(),
                            remark: "Order Stockout",
                            type: stock_out_type.OrderStockOut
                        }
                    )

                    for (var p of req.body.products) {
                        stock_out.products.push({ _id: p._id, stock_out_qty: p.order_qty });

                        await Inventory.findByIdAndUpdate({ _id: p._id }, { qty: p.qty - p.order_qty });
                    }

                    // console.log("\n\nStockout: ", stock_out);

                    await stock_out.save();
                }

                res.status(200).json({ meta: meta.OK, message: msg.messages.record_update });
            }
            else {
                res.status(404).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
            }
        })
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function deleteOrder(req, res) {
    try {
        Order.findByIdAndDelete(req.params.id, (err, data) => {
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