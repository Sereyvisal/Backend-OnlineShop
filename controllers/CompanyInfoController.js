import CompanyInfo from "../models/CompanyInfo.js";
import { meta } from "../utils/enum.js";
import * as msg from "../utils/message.js";
import mongoose from "mongoose";

// export async function listCompanyInfo(req, res) {
//     try {
//         let companyInfos, totalCount;

//         companyInfos = await CompanyInfo.find();
//         totalCount = await CompanyInfo.find().countDocuments();

//         res.status(200).json({ meta: meta.OK, datas: companyInfos, total: totalCount });
        
//     }
//     catch (err) {
//         res.status(404).json({ meta: meta.ERROR, message: err.message });
//     }
// }

export async function getCompanyInfo(req, res) {
    try {
        const companyInfo = await CompanyInfo.find();

        if (companyInfo == null){
            res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
        }
        else {
            res.status(200).json({ meta: meta.OK, data: companyInfo[0] });
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function upsertCompanyInfo(req, res) {
    try {
        if (!req.body._id) req.body._id = new mongoose.mongo.ObjectID();

        CompanyInfo.findOneAndUpdate({ _id: req.body._id }, req.body, { upsert: true }, (err, data) => {
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

// export async function deleteCompanyInfo(req, res) {
//     try {
//         CompanyInfo.findByIdAndDelete(req.params.id, (err, data) => {
//             if (err) {
//                 res.status(404).json({ meta: meta.ERROR, message: err.message });
//                 return true;
//             }

//             if (data != null) {
//                 res.status(200).json({ meta: meta.OK, message: msg.messages.record_delete });
//             }
//             else {
//                 res.status(404).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
//             }
//         });
//     }
//     catch (err) {
//         res.status(404).json({ meta: meta.ERROR, message: err.message });
//     }
// }