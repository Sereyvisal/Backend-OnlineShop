import bcrypt from "bcrypt";
import { meta } from "../utils/enum.js";
import * as msg from "../utils/message.js";
import jwt from "jsonwebtoken"
import "dotenv/config"

export async function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
        // req.token = bearerHeader;

        jwt.verify(bearerHeader, process.env.TOKEN_SECRET, function (err, decoded) {
            if (err) {
                res.status(200).send({ meta: meta.TOKENEXPIRE, message: msg.error_msg.token_expired })
                return true;
            }

            req.user = decoded.data;

            next()
        });
    }
    else {
        res.status(403).send({ meta: meta.UNAUTHEORIZED, message: msg.error_msg.token_required })
    }
}

export async function hashPwd(pwd) {
    return await bcrypt.hash(pwd, await bcrypt.genSalt(10));
}

export function hashPwdSync(pwd) {
    return bcrypt.hashSync(pwd, bcrypt.genSaltSync(10));
}

export async function validatePwd(pwd, dbPwd) {
    return bcrypt.compare(pwd, dbPwd);
}