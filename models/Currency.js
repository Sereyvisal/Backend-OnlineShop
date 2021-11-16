import mongoose from "mongoose";
import moment from "moment";

const CurrencySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    currency_symbol: {
        type: String,
        required: true
    },
    exchange_rate: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: moment().format("MM-DD-YYYY"),
        required: true
    },
    remark: {
        type: String,
        default: null,
    },
    is_default: {
        type: Boolean,
        default: false
    }
},
{
    versionKey: false
})

export default mongoose.model("currency", CurrencySchema, "currency");