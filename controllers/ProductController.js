import Product from "../models/Product.js";
import ProductItem from "../models/ProductItem.js";
import mongoose from "mongoose";
import { meta } from "../utils/enum.js";
import * as msg from "../utils/message.js";
import moment from "moment";

export async function listProduct(req, res) {
  try {
    const search = req.body;

    search.keyword = search.keyword || "";
    search.category = search.category || "";

    Product.find().sort([[ "_id", -1]]).exec(async (err, datas) => {
      if (err) {
        res.status(200).json({ meta: meta.OK, message: err.message });
        return;
      }

      if (search.keyword != "" && search.category == "") {
        datas = await Product.find({
          product_no: { $regex: search.keyword, $options: "i" } 
        }).populate("category").sort([[ "_id", -1]])
      } 

      else if (search.category != "" && search.keyword == "") {
        datas = await Product.find({
          category: search.category,
        }).populate("category").sort([[ "_id", -1]])
      } 

      else if (search.keyword != "" && search.category != "") {
        datas = await Product.find({
          $and: [
            { product_no: { $regex: search.keyword, $options: "i" } },
            { category: search.category },
          ],
        }).populate("category").sort([[ "_id", -1]])
      }
      else {
        datas = await Promise.all(datas.map((p) => p.fillObject(p)));
      }

      res.status(200).json({ meta: meta.OK, datas: datas });
    });
  } catch (err) {
    res.status(500).json({ meta: meta.OK, message: err.message });
  }
}

export function getProduct(req, res) {
  try {
    Product.findById(req.params.id).exec(async (err, data) => {
      if (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
        return true;
      }

      if (data == null) {
        res
          .status(200).json({ meta: meta.ERROR, message: msg.messages.record_notexist });
        return;
      }

      data = await data.fillObject(data);

      res.status(200).json({ meta: meta.OK, data: data });
    });
  } catch (err) {
    res.status(500).json({ meta: meta.ERROR, message: err.message });
  }
}

export async function upsertProduct(req, res) {
  try {
    var product = req.body.product;
    const product_items = req.body.product_items;
    const is_change = req.body.is_change;

    // TODO: Test upsert with created date and sort newest product
    (!product.create_date) ? product.create_date = moment().format("MM-DD-YYYY hh:mm A") : product.create_date;

    console.log(product);

    Product.findOneAndUpdate(
      { _id: product._id || new mongoose.Types.ObjectId() },
      product,
      { upsert: true, new: true },
      (err, doc) => {
        if (err) {
          res.status(400).json({ meta: meta.ERROR, message: err.message });
          return;
        }
        product_items.forEach((p) => {
          p.product_id = p.product_id || doc._id;
          ProductItem.findOneAndUpdate(
            { _id: p._id || new mongoose.Types.ObjectId() },
            p,
            { upsert: true },
            (pErr) => {
              if (pErr) {
                res
                  .status(400)
                  .json({ meta: meta.ERROR, message: pErr.message });
                return;
              }
            }
          );
        })
        res
          .status(200)
          .json({ meta: meta.OK, message: msg.messages.record_update });
      }
    );
    // if (!product._id) {
    //     const savedProduct = await Product(product).save();

    //     product_items.forEach(p => p.product_id = savedProduct._id);

    //     ProductItem.insertMany(product_items, (err, datas) => {
    //         if (err) {
    //             console.log("New Product Error", err.message);
    //             res.status(200).json({ meta: meta.ERROR, message: err.message });
    //             return true;
    //         }

    //         if (datas == null) {
    //             res.status(200).json({ meta: meta.OK, message: "ERR" });
    //             return;
    //         }

    //         res.status(200).json({ meta: meta.OK, data: datas });
    //     });

    //     //Old Version
        // Product(req.body).save()
        //     .then(data => {
        //         console.log(data);

        //         res.status(200).json({ meta: meta.OK, data: data });

        //         // items.forEach(e => e.product_id = data._id)

        //         // ProductItem.insertMany(items, (err, datas) => {
        //         //     if (err) {
        //         //         res.status(500).json({ meta: meta.ERROR, message: err.message });
        //         //         return true;
        //         //     }

        //         //     if (datas != null) {
        //         //         res.status(200).json({ meta: meta.OK, data: datas });
        //         //     }
        //         // })
        //     })
        //     .catch(err => {
        //         res.status(500).json({ meta: meta.ERROR, message: err.message })
        //     });
    // }
    // else {
    //     if (is_change) {
    //         const items = product.product_items;

    //         items.forEach(async p => {
    //             await ProductItem.findByIdAndDelete(p._id);
    //         });

    //         delete product.product_items;
    //     };

    //     product_items.forEach(e => {
    //         ProductItem.findOneAndUpdate({ _id: e._id || mongoose.Types.ObjectId() }, e, { upsert: true, new: true }, (err, datas) => {
    //             if (err) {
    //                 console.log("Product Item Err", err.message);
    //                 return true;
    //             }
    //         })
    //     })

    //     Product.findByIdAndUpdate(product.id, product).exec((err, data) => {
    //         if (err) {
    //             res.status(200).json({ meta: meta.ERROR, message: err.message });
    //             return true;
    //         }

    //         if (data == null) {
    //             res.status(200).json({ meta: meta.ERROR, message: msg.messages.record_notexist });
    //             return;
    //         }

    //         res.status(200).json({ meta: meta.OK, message: msg.messages.record_update });
    //     })
    // }
  } catch (error) {
    res.status(500).json({ meta: meta.ERROR, message: error.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const tempProduct = await Product.findById(req.params.id);

    if (!tempProduct.is_in_use) {
      Product.findByIdAndDelete(req.params.id).exec(async (err, data) => {
        if (err) {
          res.status(200).json({ meta: meta.ERROR, message: err.message });
          return;
        }

        if (data == null) {
          res
            .status(200)
            .json({ meta: meta.ERROR, message: msg.messages.record_notexist });
          return;
        }

        const items = await ProductItem.find({ product_id: req.params.id });

        items.forEach(async (p) => await ProductItem.findByIdAndDelete(p._id));

        res
          .status(200)
          .json({ meta: meta.OK, message: msg.messages.record_delete });
      });
    } else {
      Product.findByIdAndUpdate(req.params.id, {
        is_active: !tempProduct.is_active,
      }).exec(async (err, data) => {
        if (err) {
          res.status(200).json({ meta: meta.ERROR, message: err.message });
          return;
        }

        if (data == null) {
          res
            .status(200)
            .json({ meta: meta.ERROR, message: msg.messages.record_notexist });
          return;
        }

        const items = await ProductItem.find({ product_id: req.params.id });

        items.forEach(
          async (p) =>
            await ProductItem.findByIdAndUpdate(p._id, {
              is_active: !tempProduct.is_active,
            })
        );

        res.status(200).json({
          meta: meta.OK,
          message: "Product status successfully changed",
        });
      });
    }
  } catch (err) {
    res.status(500).json({ meta: meta.ERROR, message: err.message });
  }
}
