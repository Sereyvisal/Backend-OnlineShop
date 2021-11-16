import mongoose from "mongoose";
import { meta } from "../utils/enum.js";
import * as msg from "../utils/message.js";

export async function upload(req, res) {
  req.file.md5 = req.file.id + req.file.md5;
  res.status(200).json({ meta: meta.OK, file: req.file });
}

export async function uploads(req, res) {
  const arr = req.files.map((p) => {
    return {
      md5: p.id + p.md5,
      filename: p.filename,
      contentType: p.contentType,
      id: p.id,
    };
  });

  res.status(200).json({ meta: meta.OK, files: arr });
}

export async function deleteFile(req, res) {
  try {
    const id = mongoose.Types.ObjectId(req.params.md5.substring(0, 24));
    const md5 = req.params.md5.substring(24, req.params.md5.length);
    global.myGFS.files.findOne({ _id: id, md5: md5 }, (err, file) => {
      if (err) {
        res.status(400).json({ meta: meta.ERROR, err: msg.error_msg.ERROR });
        return;
      }
      if (!file || file.length == 0) {
        return res
          .status(400)
          .json({ meta: meta.NOTEXIST, message: msg.file_err_msg.notExist });
      }

      global.myGFS.remove(
        { _id: file._id, root: global.collectionName },
        (err, GridFSBucket) => {
          if (err) {
            return res
              .status(400)
              .json({ meta: meta.ERROR, err: msg.error_msg.notExist });
          }

          res
            .status(200)
            .json({ meta: meta.OK, err: msg.messages.record_delete });
        }
      );
    });
  } catch (error) {
      // console.log(req.params.md5);
    res.status(500).json({
      meta: meta.ERROR,
      message: error.message + " at deleteFile",
    });
  }
}

export async function deleteFileInternal(fileMd5) {
  const id = mongoose.Types.ObjectId(fileMd5.substring(0, 24));
  const md5 = fileMd5.substring(24, fileMd5.length);

  const file = await global.myGFS.files.findOne({ _id: id, md5: md5 });

  if (!file) {
    // console.log(file);
    return meta.NOTEXIST;
  }

  await global.myGFS.remove({ _id: file._id, root: global.collectionName });

  return meta.OK;
}

export async function getFile(req, res) {
  try {
    const id = mongoose.Types.ObjectId(req.params.md5.substring(0, 24));
  const md5 = req.params.md5.substring(24, req.params.md5.length);
  global.myGFS.files.findOne({ _id: id, md5: md5 }, (err, file) => {
    if (!file || file.length == 0) {
      return res
        .status(404)
        .json({ meta: meta.NOTEXIST, message: msg.file_err_msg.notExist });
    }

    if (file.contentType === "application/pdf") {
      const stream = global.myGFS.createReadStream(file.filename);
      stream.pipe(res);
    } else if (
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png"
    ) {
      const stream = global.myGFS.createReadStream(file.filename);
      stream.pipe(res);
    } else {
      res
        .status(404)
        .json({
          meta: meta.NOTFILETYPE,
          message: msg.file_err_msg.notFileType,
        });
    }
  });
  } catch (error) {
    res
        .status(500)
        .json({ meta: meta.ERROR, message: msg.messages.ERROR });
  }
  
}

export async function getFileObj(req, res) {
  const id = mongoose.Types.ObjectId(req.params.md5.substring(0, 24));
  const md5 = req.params.md5.substring(24, req.params.md5.length);
  global.myGFS.files.findOne({ _id: id, md5: md5 }, (err, file) => {
    if (!file || file.length == 0) {
      return res.status(404).json({
        meta: meta.NOTEXIST,
        err: msg.notExist,
      });
    }

    return res.status(200).json({ meta: meta.OK, file: file });
  });
}
