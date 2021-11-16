import Role from "../models/Role.js";
import { meta } from "../utils/enum.js";
import * as msg from "../utils/message.js";

export async function listRole(req, res) {
    try {
        let roles, totalCount;
        
        roles = await Role.find().skip(0);
        totalCount = await Role.find().countDocuments();

        res.status(200).json({ meta: meta.OK, datas: roles, total: totalCount });
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function getRole(req, res) {
    try {
        const role = await Role.findById(req.params.id);

        if(role == null){
            res.status(200).json({ meta: meta.ERROR, message: msg.messages.record_notexist });
        }
        else{
            res.status(200).json({ meta: meta.OK, data: role });
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function upsertRole(req, res) {
    try {
        if (req.body._id === undefined || req.body._id == "") {
            // delete req.body._id;

            const role = new Role(req.body);

            role.save()
                .then(data => {
                    res.status(200).json({ meta: meta.OK, message: msg.messages.record_add });
                })
                .catch(err => {
                    res.status(404).json({ meta: meta.ERROR, message: err.message });
                });
        }
        else {
            await Role.findByIdAndUpdate({ _id: req.body._id }, req.body, (err, data) => {
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

export async function deleteRole(req, res) {
    try {
        Role.findByIdAndDelete(req.params.id, (err, data) => {
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