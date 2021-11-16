import ProductItem from "../models/ProductItem.js";
import { meta } from "../utils/enum.js";
import * as msg from "../utils/message.js";

export async function listProductItem(req, res) {
  try {
    const search = req.body;
    let productItems, totalCount;
    search.limit = search.limit || 0;
    search.skip = search.skip || 0;
    search.keyword = search.keyword || "";
    // search.category = search.category || "";

    // let regex = new RegExp('^'+ search.keyword +'$', "i")
    let regex = { $regex: search.keyword, $options: "i" };

    productItems = await ProductItem.find().populate({
      path: "product_id",
      match: {
        $or: [{ long_name: regex }, { name: regex }, { short_name: regex }],
      },
      populate: "category",
    })
    productItems = productItems.filter(e => e.product_id)
    productItems = productItems.slice(search.skip, search.limit ? search.limit + search.skip : productItems.length)
    totalCount = await ProductItem.countDocuments();
    
    res
      .status(200)
      .json({ meta: meta.OK, datas: productItems, total: totalCount });

  } catch (err) {
    res.status(500).json({ meta: meta.ERROR, message: err.message });
  }
}

export async function getProductItem(req, res) {
  try {
    ProductItem.findById(req.params.id).exec((err, data) => {
      if (err) {
        res.status(200).json({ meta: meta.ERROR, message: err.message });
        return true;
      }

      if (data != null) {
        res.status(200).json({ meta: meta.OK, data: data });
      } else {
        res
          .status(200)
          .json({ meta: meta.ERROR, message: msg.messages.record_notexist });
      }
    });
  } catch (err) {
    res.status(500).json({ meta: meta.ERROR, message: err.message });
  }
}

export async function getProductItemsByProduct(req, res) {
  try {
      var items = await ProductItem.find({ product_id: req.params.id})
      if(items.length > 0){
          res.status(200).json({ meta: meta.OK, data: items });
      }else{
          res.status(200).json({ meta: meta.ERROR, message: msg.messages.record_notexist });
      }
  } catch (err) {
      res.status(500).json({ meta: meta.ERROR, message: err.message });
  }
}

export async function upsertProductItem(req, res) {
  try {
    if (req.body._id == "" || req.body._id == undefined) {
      ProductItem(req.body)
        .save()
        .then((data) => {
          res.status(200).json({
            meta: meta.OK,
            message: msg.messages.record_add,
            data: data,
          });
        })
        .catch((err) => {
          res.status(500).json({ meta: meta.ERROR, message: err.message });
        });
    } else {
      ProductItem.findByIdAndUpdate(req.body._id, req.body).exec((err, data) => {
        if (err) {
          res.status(200).json({ meta: meta.ERROR, message: err.message });
          return true;
        }

        if (data != null) {
          res
            .status(200)
            .json({ meta: meta.OK, message: msg.messages.record_update });
        } else {
          res.status(200).json({
            meta: meta.NOTEXIST,
            message: msg.messages.record_notexist,
          });
        }
      });
    }
  } catch (err) {
    res.status(500).json({ meta: meta.ERROR, message: err.message });
  }
}

export async function deleteProductItem(req, res) {
  try {
    // const tempProductItem = await ProductItem.findById(req.params.id);

    ProductItem.findByIdAndDelete(req.params.id).exec((err, data) => {
      if (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
        return true;
      }

      if (data != null) {
        res
          .status(200)
          .json({ meta: meta.OK, message: msg.messages.record_delete });
      } else {
        res
          .status(200)
          .json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
      }
    });
  } catch (err) {
    res.status(500).json({ meta: meta.ERROR, message: err.message });
  }
}

export async function deactivateProductItem(req, res) {
  try {
    const tempProductItem = await ProductItem.findById(req.params.id);

    ProductItem.findByIdAndUpdate(req.params.id, {
      is_active: !tempProductItem.is_active,
    }).exec((err, data) => {
      if (err) {
        res.status(400).json({ meta: meta.ERROR, message: err.message });
        return true;
      }

      if (data != null) {
        res
          .status(200)
          .json({ meta: meta.OK, message: msg.messages.record_delete });
      } else {
        res
          .status(200)
          .json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
      }
    });
  } catch (err) {
    res.status(500).json({ meta: meta.ERROR, message: err.message });
  }
}

export async function deleteProductItems(req, res) {
  try {
    const ids = req.body.map((p) => p._id);

    ProductItem.deleteMany({ _id: ids }, (err, data) => {
      if (err) {
        res.status(200).json({ meta: meta.ERROR, message: err.message });
        return;
      }

      if (data == null) {
        res
          .status(200)
          .json({ meta: meta.NOTEXIST, message: msg.messages.record_notexist });
        return;
      }

      res
        .status(200)
        .json({ meta: meta.OK, message: msg.messages.record_delete });
    });
  } catch (err) {
    res.status(500).json({ meta: meta.ERROR, message: err.message });
  }
}
