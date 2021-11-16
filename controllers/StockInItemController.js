import StockInItem from "../models/StockInItem.js";
import { meta } from "../utils/enum.js";
import * as msg from "../utils/message.js";

export async function listStockInItem(req, res) {
    try {
        let stockInItems, totalCount;

        stockInItems = await StockInItem.find().populate("inventory");

        totalCount = await StockInItem.find().countDocuments();
    
        Promise.all(stockInItems.map(async(p) => await p.fillObject(p)))
        .then(p => {
            res.status(200).json({ meta: meta.OK, datas: p, total: totalCount });
        })
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function getStockInItem(req, res) {
    try {
        const stockInItem = await StockInItem.findById(req.params.id).populate("inventory");

        if(stockInItem == null){
            res.status(200).json({ meta: meta.ERROR, message: msg.messages.record_notexist });
        }
        else{
            res.status(200).json({ meta: meta.OK, data: stockInItem });
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function upsertStockInItem(req, res) {
    try {
        if (req.body._id === undefined || req.body._id == "") {
            const stockInItem = new StockInItem(req.body);

            stockInItem.save()
                .then(data => {
                    res.status(200).json({ meta: meta.OK, message: msg.messages.record_add });
                })
                .catch(err => {
                    res.status(404).json({ meta: meta.ERROR, message: err.message });
                });
        }
        else {
            await StockInItem.findByIdAndUpdate({ _id: req.body._id }, req.body, (err, data) => {
                if (err) {
                    res.status(404).json({ meta: meta.ERROR, message: err.message });
                    return true;
                }

                if (data != null) {
                    res.status(200).json({ meta: meta.OK, message: msg.messages.record_update });
                }
                else {
                    res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
                }
            });
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function deleteStockInItem(req, res) {
    try {
        StockInItem.findByIdAndDelete(req.params.id, (err, data) => {
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