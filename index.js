import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import serverConfig from "./utils/serverConfig.js";
import { verifyToken } from "./utils/permission.js";

//Routes
import userRoute from "./routes/user.js";
import loginRoute from "./routes/auth.js";
import uploadRoute from "./routes/upload.js";
import currencyRoute from "./routes/currency.js"
import roleRoute from "./routes/role.js"
import categoryRoute from "./routes/category.js"
import productRoute from "./routes/product.js"
import productitemRoute from "./routes/productitem.js"
import productAttrRoute from "./routes/product_attr.js";
import inventoryRoute from "./routes/inventory.js"
import stockinRoute from "./routes/stock_in.js"
import stockoutRoute from "./routes/stock_out.js"
import stockinitemRoute from "./routes/stock_in_item.js"
import orderRoute from "./routes/order.js"
import companyinfoRoute from "./routes/companyinfo.js"
import cartRoute from "./routes/cart.js";

const app = express();
const port = 3000;
const server = createServer(app);

const startServer = () => {
    mongoose.connect(
        serverConfig.db_connection,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }
    );

    app.use(cors());
    app.use(express.json());

    app.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        );
        next();
    });

    app.use("/", loginRoute);
    app.use("/", uploadRoute);
    app.use("/user", verifyToken, userRoute);
    app.use("/role", verifyToken, roleRoute);
    app.use("/currency", verifyToken, currencyRoute);
    app.use("/category", categoryRoute);
    app.use("/product", productRoute);
    app.use("/productitem", verifyToken, productitemRoute);
    app.use("/productattr", verifyToken, productAttrRoute);
    app.use("/inventory", inventoryRoute);
    app.use("/stockin", verifyToken, stockinRoute);
    app.use("/stockout", verifyToken, stockoutRoute);
    app.use("/stockinitem", verifyToken, stockinitemRoute);
    app.use("/order", verifyToken, orderRoute);
    app.use("/companyinfo", companyinfoRoute);
    app.use("/cart", verifyToken, cartRoute);

    server.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
}

startServer();
