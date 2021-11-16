import StockIn from "../models/StockIn.js";
import StockInItem from "../models/StockInItem.js";
import mongoose from "mongoose";
import { meta, status_type } from "../utils/enum.js";
import * as msg from "../utils/message.js"
import Inventory from "../models/Inventory.js";
import moment from "moment";
import Product from "../models/Product.js";

export async function listStockIn(req, res) {
    try {
        let stockIns, totalCount = [];

        stockIns = await StockIn.find().populate("inventory").sort([["stock_in_date", -1]]);

        totalCount = await (await StockIn.find()).length;

        Promise.all(stockIns.map(async p => await p.fillObject(p)))
            .then(p => {
                res.status(200).json({ meta: meta.OK, datas: p, total: totalCount })
            })

    } catch (err) {
        res.status(500).json({ meta: meta.ERROR, message: err.message });
    }
};

export async function getStockIn(req, res) {
    try {
        const stockIn = await StockIn.findById(req.params.id).populate("inventory");

        if (stockIn == null) {
            res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
        }
        else {
            const result = await stockIn.fillObject(stockIn);

            res.status(200).json({ meta: meta.OK, data: result });
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function upsertStockIn(req, res) {
    try {
        var product_item = req.body.product_item;
        // console.log("\n\nproduct_item: ", product_item);

        const inventory = await Inventory.find({ product_info_id: product_item._id })

        if (req.body._id == undefined || req.body._id == "") {
            if (inventory.length == 0) {
                var temp = {
                    product_info_id: product_item._id,
                    qty: product_item.qty
                };
    
                const new_inventory = await Inventory(temp).save()
    
                product_item.inventory_id = new_inventory._id;
            }
            else {
                product_item.inventory_id = inventory[0]._id;
                inventory[0].qty += product_item.qty;
    
                await Inventory.findByIdAndUpdate({ _id: inventory[0]._id }, inventory[0]);
            }

            var tempStockIn = {
                stock_in_date: moment().format("MM-DD-YYYY hh:mm A"),
                remark: req.body.remark,
                attachments: req.body.attachments,
                inventory: product_item.inventory_id,
                qty: product_item.qty
            }

            await StockIn(tempStockIn).save().then(async data => {
                await Product.findOneAndUpdate({  _id: product_item.main_product_id }, { is_in_use: true });
            });

            res.status(200).json({ meta: meta.OK, message: msg.messages.record_add })
        }
        else {
            let old_stockIn = await StockIn.findById(req.body._id);

            let old_inventory = await Inventory.findById(old_stockIn.inventory);

            if (inventory.length == 0) {
                var temp = {
                    product_info_id: product_item._id,
                    qty: product_item.qty
                };
    
                const new_inventory = await Inventory(temp).save()
    
                product_item.inventory_id = new_inventory._id;

                await Inventory.findByIdAndUpdate({ _id: old_stockIn.inventory }, { qty: old_inventory.qty - old_stockIn.qty });
            }
            else {
                product_item.inventory_id = inventory[0]._id;

                if (old_inventory._id.toString() == inventory[0]._id.toString()) {
                    if (product_item.qty > old_stockIn.qty) {
                        var remain = product_item.qty - old_stockIn.qty;
                        inventory[0].qty += remain;
                    }
                    else if (old_stockIn.qty > product_item.qty) {
                        var remain = old_stockIn.qty - product_item.qty;
                        inventory[0].qty -= remain;
                    }

                    await Inventory.findByIdAndUpdate({ _id: inventory[0]._id }, inventory[0]);
                }
                else {
                    await Inventory.findByIdAndUpdate({ _id: old_stockIn.inventory }, { qty: old_inventory.qty - old_stockIn.qty });

                    await Inventory.findByIdAndUpdate({ _id: inventory[0]._id }, { qty: inventory[0].qty + product_item.qty });
                }
            }
            
            var tempStockIn = {
                _id: req.body._id,
                stock_in_date: req.body.stock_in_date,
                remark: req.body.remark,
                attachments: req.body.attachments,
                inventory: product_item.inventory_id,
                qty: product_item.qty
            }

            await StockIn.findByIdAndUpdate({ _id: tempStockIn._id }, tempStockIn, (err, data) => {
                if (err) {
                    res.status(404).json({ meta: meta.ERROR, message: err.message });
                    return true;
                }

                if (data != null) {
                    res.status(200).json({ meta: meta.OK, message: msg.messages.record_update });
                }
            });
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}


export async function deleteStockIn(req, res) {
    try {

        StockIn.findByIdAndDelete(req.params.id, (err, data) => {
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