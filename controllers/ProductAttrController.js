import ProductAttr from "../models/ProductAttr.js";
import { meta } from "../utils/enum.js";
import * as msg from "../utils/message.js";

export async function listProductAttr(req, res){
       
    try {
        let result = [];
        await ProductAttr.find().exec((err, datas) => {
            if(err) {
                res.status(200).json({ meta: meta.ERROR, message: err.message});
                return true;
            }
           
            // datas.forEach((p) => result.push(p.fillObject(p)));
            res.status(200).json({meta: meta.OK, datas: datas, total: result.length});    

        });

    } catch (err) {
        res.status(500).json({ meta: meta.ERROR, message: err.message });
    }

}

export async function getProductAttr(req, res){
    try {
        ProductAttr.findById(req.params.id).exec((err, data) => {
            if(err) {
                res.status(200).json({ meta: meta.ERROR, message: err.message });
                return true;
            }

            if(data != null) {
                res.status(200).json({ meta: meta.OK, data: data});
            } else {
                res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
            }
        });
        
    } catch (err){
        res.status(500).json({meta: meta.ERROR, message: err.message});
    }
}

export function upsertProductAttr(req, res){
    try{
        if(req.body._id == "" || req.body._id == undefined) {
            ProductAttr(req.body)
                .save()
                .then(() => 
                    res
                        .status(200)
                        .json({ meta: meta.OK, message: msg.messages.record_add })
                )
                .catch((err) => res.status(500).json({meta: meta.ERROR, message: err.message })
                );
        } else {
            ProductAttr.findByIdAndUpdate(req.body._id, req.body).exec((err, data) => {
                if(err) {
                    res.status(200).json({meta: meta.ERROR, message: err.message });
                    return true;
                }

                if(data != null) {
                    res
                        .status(200)
                        .json({ meta: meta.OK, message: msg.messages.record_update});
                } else {
                    res.status(200)
                    .json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist});
                }
            });
        }
    } 
    catch (err){
        res.status(500).json({meta: meta.ERROR, message: err.message });
    }
}

export function deleteProductAttr(req, res) {
    try {
        ProductAttr.findByIdAndDelete(req.params.id).exec((err, data) => {
            if(err) {
                res.status(200).json({ meta: meta.ERROR, message: err.message});
                return true;
            }
            if(data != null) {
                res 
                    .status(200)
                    .json({meta: meta.OK, message: msg.messages.record_delete });
            } else {
                res 
                    .status(200)
                    .json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist});
            }
        });
    } catch (err) {
        res.status(500).json({ meta: meta.ERROR, message: err.message});
    }
}
