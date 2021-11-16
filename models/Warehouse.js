import mongoose from "mongoose";

const WarehouseSchema = mongoose.Schema({
    warehouse_id: {
        type: String,
        required: true
    },
    warehouse_name: {
        type: String,
        required: true
    },
    person_in_charge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    remark: {
        type: String,
        default: null,
    }
},
{
    versionKey: false
})

export default mongoose.model("warehouse", WarehouseSchema, "warehouse");