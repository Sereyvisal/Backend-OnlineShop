import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import { meta } from "../utils/enum.js";
import * as msg from "../utils/message.js";
import mongoose from "mongoose";

export async function listInventory(req, res) {
    try {
        let inventories, totalCount;

        inventories = await Inventory.find().sort([[ "_id", -1]]);

        totalCount = await Inventory.find().countDocuments();
    
        Promise.all(inventories.map(async(p) => await p.fillObject(p)))
        .then(p => {
            res.status(200).json({ meta: meta.OK, datas: p, total: totalCount });
        })
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function getInventory(req, res) {
    try {
        const inventory = await Inventory.findById(req.params.id);

        if(inventory == null){
            res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
        }
        else{
            res.status(200).json({ meta: meta.OK, data: inventory });
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function getInventoryByProductId(req, res) {
    try {
        const inventory = await Inventory.findOne({ product_info_id: req.params.id });

        if(inventory == null){
            res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
        }
        else{
            res.status(200).json({ meta: meta.OK, data: inventory });
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

// export async function getInventoryByProductAndWarehouse(req, res) {
//     try {
//         const inventory = await Inventory.find({ product_info_id: req.params.id, warehouse_id: req.params.warehouse });

//         if(inventory == null){
//             res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
//         }
//         else{
//             res.status(200).json({ meta: meta.OK, data: inventory });
//         }
//     }
//     catch (err) {
//         res.status(404).json({ meta: meta.ERROR, message: err.message });
//     }
// }

export async function upsertInventory(req, res) {
    try {
    //     if (req.body.id === undefined || req.body.id == "") {
    //         delete req.body.id;

    //         const inventory = new Inventory(req.body);

    //         inventory.save()
    //             .then(data => {
    //                 res.status(200).json({ meta: meta.OK, message: msg.messages.record_add });
    //             })
    //             .catch(err => {
    //                 res.status(404).json({ meta: meta.ERROR, message: err.message });
    //             });
    //     }
    //     else {
    //         await Inventory.findByIdAndUpdate({ _id: req.body.id }, req.body, (err, data) => {
    //             if (err) {
    //                 res.status(404).json({ meta: meta.ERROR, message: err.message });
    //                 return true;
    //             }

    //             if (data != null) {
    //                 res.status(200).json({ meta: meta.OK, message: msg.messages.record_update });
    //             }
    //             else {
    //                 res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
    //             }
    //         });
    //     }


        if (!req.body._id) req.body._id = new mongoose.mongo.ObjectID();

        Inventory.findOneAndUpdate({ _id: req.body._id }, req.body, { upsert: true }, (err, data) => {
            if (err) {
                res.status(200).json({ meta: meta.ERROR, message: err.message });
                return;
            }
            
            res.status(200).json({ meta: meta.OK, data: data, message: msg.messages.record_update });
        });
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function deleteInventory(req, res) {
    try {
        Inventory.findByIdAndDelete(req.params.id, (err, data) => {
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