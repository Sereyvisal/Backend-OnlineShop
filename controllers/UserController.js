import User from "../models/User.js";
import { validatePwd, hashPwd } from "../utils/permission.js";
import { meta } from "../utils/enum.js";
import * as msg from "../utils/message.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import Role from "../models/Role.js";

export async function listUser(req, res) {
    try {
        const users = await User.find();

        let totalCount = await User.find().countDocuments();
    
        Promise.all(users.map(async(p) => await p.fillObject(p)))
        .then(p => {
            res.status(200).json({ meta: meta.OK, datas: p, total: totalCount });
        })
    }
    catch (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function listCustomer(req, res) {
    try {
        const users = await User.find().sort([[ "_id", -1]]);

        let totalCount = await User.find().countDocuments();
    
        Promise.all(users.map(async(p) => await p.fillObject(p)))
        .then(p => {
            p = p.filter(e => e.role.role_id == 2 && e.role.role_name == "customer");

            res.status(200).json({ meta: meta.OK, datas: p, total: totalCount });
        })
    }
    catch (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function isAdmin(req, res) {
    try {
        var user = await User.findOne({ email: req.body.email });

        if (user != null) {
            var checkPwd = await validatePwd(req.body.password, user.password);

            user = await user.fillObject(user);
            user.isAdmin = false;

            if (checkPwd) {
                if (user.role.role_name == "admin" && user.role.role_id == "1") {
                    user.isAdmin = true;
                }
            }

            res.status(200).json({ meta: meta.OK, data: user });
        }
        else {
            res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
        }
        
    }
    catch (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function getUser(req, res) {
    try {
        const user = await User.findById(req.params.id);
        const result = await user.fillObject(user);

        res.status(200).json({ meta: meta.OK, data: result });
    }
    catch (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function addUser(req, res) {
    // const user = new User({ username: req.body.username, password: await hashPwd(req.body.password) });

    req.body.password = await hashPwd(req.body.password);

    const user = new User(req.body);

    user.save()
        .then(data => {
            res.status(200).json({ meta: meta.OK, data: data });
        }).catch(err => {
            res.status(200).json({ meta: meta.ERROR, message: err.message });
        });
}

export async function updateUser(req, res) {
    try {
        // await User.updateOne({ _id: req.params.id }, { username: req.body.username, password: await hashPwd(req.body.password) });

        // res.status(200).json({ meta: meta.OK });


        // req.body.password = await hashPwd(req.body.password);

        await User.findByIdAndUpdate({ _id: req.body._id }, req.body, async (err, data) => {
            if (err) {
                res.status(404).json({ meta: meta.ERROR, message: err.message });
                return true;
            }

            if (data != null) {
                const user = new User(req.body);
                const result = await user.fillObject(user);
                console.log("\n\nData: ", result);

                res.status(200).json({ meta: meta.OK, data: result, message: msg.messages.record_update });
            }
            else {
                res.status(200).json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
            }
        });
    }
    catch (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function deleteUser(req, res) {
    try {
        await User.remove({ _id: req.params.id });

        res.status(200).json({ meta: meta.OK, message: msg.messages.record_delete });
    }
    catch (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user != null) {

            // user.login_ip = req.connection.remoteAddress;
            user.login_time = moment().format("MM/DD/YYYY");
            
            const checkPwd = await validatePwd(req.body.password, user.password);

            user.save();

            const result = await user.fillObject(user);

            //Change Expires time doc for ref https://github.com/vercel/ms
            if (checkPwd) {
                jwt.sign({ data: await user.payload(user) }, process.env.TOKEN_SECRET, { expiresIn: '7d' }, (err, token) => {
                    result.token = token;

                    return res.status(200).json({ meta: meta.OK, data: result });
                });
            }
            else {
                res.status(200).json({ meta: meta.NOTUSERPWD, message: msg.error_msg.not_username_pwd });
            }
        }
        else {
            res.status(200).json({ meta: meta.NOTUSERPWD, message: msg.error_msg.not_username_pwd });
        }
    }
    catch(err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function register(req, res) {
    if (!req.body.role) {
        const roles = await Role.find();
        const customer_role = roles.find(e => e.role_name == 'customer');

        if (customer_role) {
            req.body.role = customer_role;
        }
    }

    req.body.password = await hashPwd(req.body.password);
    const user = new User(req.body);

    user.save()
        .then(data => {
            res.status(200).json({ meta: meta.OK, data: data });
        }).catch(err => {
            res.status(200).json({ meta: meta.ERROR, message: err.message });
        });
}

export async function registerLite(req, res) {
    try {
        User(req.body).save()
            .then(data => {
                res.status(200).json({ meta: meta.OK, data: data });
            }).catch(err => {
                res.status(200).json({ meta: meta.ERROR, message: err.message });
            });
    }
    catch (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function resetPwd(req, res) {
    try {
        if (!req.body._id) {
            res.status(200).json({ meta: meta.ERROR, message: "Missing ID" });
            return;
        }

        User.findOneAndUpdate(
            { _id: req.body._id },
            { password: req.body.password },
            { upsert: true },
            (err, data) => {
                if (err) {
                    res.status(500).json({ meta: meta.ERROR, message: err.message });
                    return;
                }
                res
                    .status(200)
                    .json({ meta: meta.OK, message: msg.messages.record_update });
            }
        );
    }
    catch (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function getUserInfo(req, res) {
    try {
        const user = await User.findById(req.user._id);

        const result = await user.fillObject(user);

        res.status(200).json({ data: result });
    }
    catch (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
    }
}