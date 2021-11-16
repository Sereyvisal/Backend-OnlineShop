import Category from "../models/Category.js";
import { meta } from "../utils/enum.js";
import * as msg from "../utils/message.js";
import { FindChildObject } from "../utils/generalFunc.js";

export async function listCategory(req, res) {
    try {
        Category.find().exec(async (err, data) => {
            if (err) {
                res.status(200).json({ meta: meta.ERROR, message: err.message })
            }

            let list = [];
            let count_recommend = 0;

            for (var i of data) {
                if (i.recommend) {
                    count_recommend++;
                }

                i = i.fillObject(i);
                i.items = FindChildObject(data, i, "parent");

                if (i.parent != null && Category.findById(i.parent) != null) {
                    continue;
                }
                list.push(i);
            }
            res.status(200).json({ meta: meta.OK, datas: list, count_recommend: count_recommend });
        })

    } catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export function upsertCategory(req, res) {
    try {
        if (req.body._id == "" || req.body._id == undefined) {
            Category(req.body).save()
                .then(() => res.status(200).json({ meta: meta.OK, message: msg.messages.record_add }))
                .catch(err => res.status(404).json({ meta: meta.ERROR, message: err.message }));
        }
        else {
            Category.findByIdAndUpdate(req.body._id, req.body).exec((err, data) => {
                if (err) {
                    res.status(200).json({ meta: meta.ERROR, message: err.message });
                    return true;
                }

                if (data != null) {
                    res.status(200).json({ meta: meta.OK, message: msg.messages.record_update });
                }
                else {
                    res.status(200).json({ meta: meta.ERROR, message: msg.messages.record_notexist });
                }
            })
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export function deleteCategory(req, res) {
    try {
        Category.findByIdAndRemove(req.params.id).exec((err, data) => {
            if (err) {
                res.status(200).json({ meta: meta.ERROR, message: err.message });
                return true;
            }
            if (data != null) {
                res.status(200).json({ meta: meta.OK, message: msg.messages.record_delete });
            }
            else {
                res.status(200).json({ meta: meta.OK, message: msg.messages.record_notexist });
            }
        })
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}