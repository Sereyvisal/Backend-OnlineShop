import Currency from "../models/Currency.js";
import { meta } from "../utils/enum.js";
import * as msg from "../utils/message.js";
import moment from "moment";

export async function listCurrency(req, res) {
    try {
        let currencies, totalCount;
        const search = req.body;

        search.limit === undefined || search.limit === 0 ? search.limit == 10 : search.limit;
        search.skip === undefined || search.skip === 0 ? search.skip == 0 : search.skip;
        search.keyword === undefined || search.keyword === null ? search.keyword = "" : search.keyword;

        if (search.keyword != "") {
            currencies = await Currency.find({
                name: { $regex: search.keyword, $options: 'i' },
            }).limit(search.limit).skip(0);
        }
        else {
            currencies = await Currency.find().limit(search.limit).skip(search.skip);
        }

        totalCount = await Currency.find().countDocuments();

        res.status(200).json({ meta: meta.OK, datas: currencies, total: totalCount });
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function getCurrency(req, res) {
    try {
        const currency = await Currency.findById(req.params.id);
        
        if(currency == null){
            res.status(200).json({ meta: meta.ERROR, message: msg.messages.record_notexist });
        }
        else{
            res.status(200).json({ meta: meta.OK, data: currency });
        }
        
    }
    catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function upsertCurrency(req, res) {
    req.body.date = moment(req.body.date).toDate();

    try {
        if (req.body.id === undefined || req.body.id == "") {
            delete req.body.id;

            const currency = new Currency(req.body);

            currency.save()
                .then(data => {
                    res.status(200).json({ meta: meta.OK, message: msg.messages.record_add });
                })
                .catch(err => {
                    res.status(404).json({ meta: meta.ERROR, message: err.message });
                });
        }
        else {
            await Currency.findByIdAndUpdate({ _id: req.body.id }, req.body, (err, data) => {
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

export async function deleteCurrency(req, res) {
    try {
        Currency.findByIdAndDelete(req.params.id, (err, data) => {
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