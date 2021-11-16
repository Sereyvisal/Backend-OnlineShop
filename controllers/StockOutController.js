import StockOut from "../models/StockOut.js";
import mongoose from "mongoose";
import { meta, status_type, stock_out_type } from "../utils/enum.js";
import * as msg from "../utils/message.js"
import Inventory from "../models/Inventory.js";
import moment from "moment";

export async function listStockOut(req, res) {
    try {
        let stockOuts, totalCount = [];

        stockOuts = await StockOut.find().sort([["stock_out_date", -1]]);

        totalCount = await (await StockOut.find()).length;

        Promise.all(stockOuts.map(async p => await p.fillObject(p)))
            .then(p => {
                res.status(200).json({ meta: meta.OK, datas: p, total: totalCount })
            })

    } catch (err) {
        res.status(500).json({ meta: meta.ERROR, message: err.message });
    }
};

export async function getStockOut(req, res) {
    try {
        const stockOut = await StockOut.findById(req.params.id);

        if (stockOut == null) {
            res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
        }
        else {
            const result = await stockOut.fillObject(stockOut);

            res.status(200).json({ meta: meta.OK, data: result });
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function upsertStockOut(req, res) {
    try {
        var products = req.body.products;
        var upsert_products = [];

        if (req.body._id == undefined || req.body._id == "") {
            for (var p of products) {
                var inventory = await Inventory.find({ _id: p._id })

                upsert_products.push({ _id: inventory[0]._id, stock_out_qty: p.qty });
    
                await Inventory.findByIdAndUpdate({ _id: inventory[0]._id }, { qty: inventory[0].qty - p.qty });
            }

            var tempStockOut = {
                stock_out_date: moment().format("MM-DD-YYYY hh:mm A"),
                products: upsert_products,
                type: stock_out_type.ManualStockOut,
                remark: req.body.remark,
                attachments: req.body.attachments
            }

            await StockOut(tempStockOut).save();

            res.status(200).json({ meta: meta.OK, message: msg.messages.record_add })
        }
        else {
            let old_stockOut = await StockOut.findOne({ _id: req.body._id });

            for (var p of products) {
                upsert_products.push({ _id: p._id, stock_out_qty: p.qty });
                
                var old = old_stockOut.products.find(e => e._id == p._id);

                if (old) {
                    var inventory = await Inventory.findOne({ _id: old._id });

                    if (old.stock_out_qty > p.qty) {
                        var remain = old.stock_out_qty - p.qty;
                        await Inventory.findByIdAndUpdate({ _id: inventory._id }, { qty: inventory.qty + remain });
                    }
                    else if (p.qty > old.stock_out_qty) {
                        var remain = p.qty - old.stock_out_qty;
                        await Inventory.findByIdAndUpdate({ _id: inventory._id }, { qty: inventory.qty - remain });
                    }
                }
                else {
                    var inventory = await Inventory.findOne({ _id: p._id });
                    await Inventory.findByIdAndUpdate({ _id: inventory._id }, { qty: inventory.qty - p.qty });
                }
            }
            
            
            var tempStockOut = {
                _id: req.body._id,
                stock_out_date: req.body.stock_out_date,
                products: upsert_products,
                type: stock_out_type.ManualStockOut,
                remark: req.body.remark,
                attachments: req.body.attachments
            }

            await StockOut.findByIdAndUpdate({ _id: tempStockOut._id }, tempStockOut, (err, data) => {
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


export async function deleteStockOut(req, res) {
    try {

        StockOut.findByIdAndDelete(req.params.id, (err, data) => {
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