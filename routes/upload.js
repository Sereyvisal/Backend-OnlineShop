import express from "express"
import path from "path";
import crypto from "crypto";
import mongoose from "mongoose";
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import "dotenv/config";
import { verifyToken } from "../utils/permission.js";
import { getFile, uploads, deleteFile, getFileObj, upload as singleUpload } from "../controllers/UploadController.js";
import serverConfig from "../utils/serverConfig.js";
import { checkFileType } from "../utils/generalFunc.js";

const router = express.Router();
const collectionName = "files";
const conn = mongoose.createConnection(serverConfig.db_connection, { useNewUrlParser: true, useUnifiedTopology: true });

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection(collectionName);

    global.myGFS = gfs;
    global.collectionName = collectionName;
});

const storage = new GridFsStorage({
    url: serverConfig.db_connection,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            if (checkFileType(file)) {
                return reject("wrong file format");
            }
            else {
                crypto.randomBytes(16, (err, buf) => {
                    if (err) {
                        return reject(err.message);
                    }
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const md5 = buf.toString('hex');
                    // const filename = file.originalname;
                    const fileInfo = {
                        filename: filename,
                        bucketName: collectionName,
                        md5: md5,
                    };
                    resolve(fileInfo);
                });
            }
        });
    }
});

const upload = multer({ storage });

//File Handling
//Upload One file
router.post("/upload", verifyToken, upload.single("file"), singleUpload);

//Upload Multiple files
router.post("/uploads", verifyToken, upload.array("file"), uploads);

//Delete File
router.delete("/file/:md5", verifyToken, deleteFile);

//Get File Obj
router.get("/objfile/:md5", getFileObj);

//Get Image Result
router.get("/file/:md5", getFile);

//export all route functions
export default router;