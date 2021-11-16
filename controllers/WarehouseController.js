import Warehouse from "../models/Warehouse.js";
import { meta } from "../utils/enum.js";
import * as msg from "../utils/message.js";

export async function listWarehouse(req, res) {
    try {
        let warehouses, totalCount;
        const search = req.body;

        search.limit === undefined || search.limit === 0 ? search.limit == 10 : search.limit;
        search.skip === undefined || search.skip === 0 ? search.skip == 0 : search.skip;
        search.keyword === undefined || search.keyword === null ? search.keyword = "" : search.keyword;

        if (search.keyword != "") {
            warehouses = await Warehouse.find({
                name: { $regex: search.keyword, $options: 'i' },
            }).populate("person_in_charge", "personal_detail.firstname personal_detail.lastname").limit(search.limit).skip(0);
        }
        else {
            warehouses = await Warehouse.find().populate("person_in_charge", 'personal_detail.firstname personal_detail.lastname').limit(search.limit).skip(search.skip);

            totalCount = await Warehouse.find().countDocuments();
        }

        totalCount = await Warehouse.find().countDocuments();
        // warehouses = warehouses.map(p => {
        //     return {
        //         id: p._id,
        //         warehouse_id: p.warehouse_id,
        //         warehouse_name: p.warehouse_name,
        //         person_in_charge: p.person_in_charge,
        //         address: p.address,
        //         remark: p.remark
        //     }
        // });

        res.status(200).json({ meta: meta.OK, datas: warehouses, total: totalCount });
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function getWarehouse(req, res) {
    try {
        const warehouse = await Warehouse.findById(req.params.id).populate("person_in_charge", 'personal_detail.firstname personal_detail.lastname');

        if(warehouse == null){
            res.status(200).json({ meta: meta.ERROR, message: msg.messages.record_notexist });
        }
        else{
            res.status(200).json({ meta: meta.OK, data: warehouse });
        }
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function upsertWarehouse(req, res) {
    try {
        if (req.body._id === undefined || req.body._id == "") {
            // delete req.body._id;

            const warehouse = new Warehouse(req.body);

            warehouse.save()
                .then(data => {
                    res.status(200).json({ meta: meta.OK, message: msg.messages.record_add });
                })
                .catch(err => {
                    res.status(404).json({ meta: meta.ERROR, message: err.message });
                });
        }
        else {
            await Warehouse.findByIdAndUpdate({ _id: req.body._id }, req.body, (err, data) => {
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

export async function deleteWarehouse(req, res) {
    try {
        Warehouse.findByIdAndDelete(req.params.id, (err, data) => {
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