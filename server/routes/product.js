const express = require('express');
const router = express.Router();
const { Product } = require("../models/Product");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { auth } = require("../middleware/auth");

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Set up Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'storeapp_products', // The folder name in your Cloudinary dashboard
    allowed_formats: ['jpg', 'png', 'jpeg']
  },
});

const upload = multer({ storage: storage }).single('file');

//=================================
//             Product
//=================================

// 3. Updated Upload Route
router.post("/uploadImage", auth, (req, res) => {
    upload(req, res, error => {
        if (error) {
            return res.json({ success: false, error });
        }
        // Cloudinary returns the secure URL in req.file.path
        return res.json({ 
            success: true, 
            image: req.file.path, 
            fileName: req.file.filename 
        });
    });
});

// ... Keep your multer storage and /uploadImage route exactly the same ...

// 1. UPDATED: Added 'async' and replaced .save(callback) with await
router.post("/uploadProduct", auth, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(400).json({ success: false, e });
    }
});

// 2. UPDATED: Added 'async', replaced .exec(callback), and combined the try/catch
router.post("/getProducts", async (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let term = req.body.searchTerm;

    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    try {
        let products;
        if (term) {
            products = await Product.find(findArgs)
                .find({ $text: { $search: term } })
                .populate("writer")
                .sort([[sortBy, order]])
                .skip(skip)
                .limit(limit)
                .exec(); // Exec without callback returns a promise
        } else {
            products = await Product.find(findArgs)
                .populate("writer")
                .sort([[sortBy, order]])
                .skip(skip)
                .limit(limit)
                .exec();
        }
        return res.status(200).json({ success: true, products, postSize: products.length });
    } catch (err) {
        return res.status(400).json({ success: false, err });
    }
});


// 2. UPDATED: Added 'async', replaced .exec(callback), and combined the try/catch
router.post("/getProducts", async (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let term = req.body.searchTerm;

    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    try {
        let products;
        if (term) {
            products = await Product.find(findArgs)
                .find({ $text: { $search: term } })
                .populate("writer")
                .sort([[sortBy, order]])
                .skip(skip)
                .limit(limit)
                .exec(); // Exec without callback returns a promise
        } else {
            products = await Product.find(findArgs)
                .populate("writer")
                .sort([[sortBy, order]])
                .skip(skip)
                .limit(limit)
                .exec();
        }
        return res.status(200).json({ success: true, products, postSize: products.length });
    } catch (err) {
        return res.status(400).json({ success: false, err });
    }
});

module.exports = router;
