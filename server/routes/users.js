const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Payment } = require("../models/Payment");
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    });
});

router.post("/register", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        return res.status(200).json({
            success: true
        });
    } catch (err) {
        return res.json({ success: false, err });
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
        }

        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.json({ loginSuccess: false, message: "Wrong password" });
        }

    const userWithToken = await user.generateToken();
        
        // Add these security options for cross-origin cookies
        const cookieOptions = {
            httpOnly: true,
            secure: true, // Requires HTTPS (which Render uses)
            sameSite: 'none' // Explicitly allows cross-site cookies
        };

        res.cookie("w_authExp", userWithToken.tokenExp, cookieOptions);
        res.cookie("w_auth", userWithToken.token, cookieOptions)
            .status(200)
            .json({
                loginSuccess: true, userId: userWithToken._id
            });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/logout", auth, async (req, res) => {
    try {
        await User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" });
        return res.status(200).send({
            success: true
        });
    } catch (err) {
        return res.json({ success: false, err });
    }
});

router.post('/addToCart', auth, async (req, res) => {
    try {
        const userInfo = await User.findOne({ _id: req.user._id });
        const duplicate = userInfo.cart.some(item => item.id === req.query.productId);

        if (duplicate) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.user._id, "cart.id": req.query.productId },
                { $inc: { "cart.$.quantity": 1 } },
                { new: true }
            );
            res.status(200).json(updatedUser.cart);
        } else {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $push: {
                        cart: {
                            id: req.query.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true }
            );
            res.status(200).json(updatedUser.cart);
        }
    } catch (err) {
        return res.json({ success: false, err });
    }
});

router.post('/removeFromCart', auth, async (req, res) => {
    try {
        const userInfo = await User.findOneAndUpdate(
            { _id: req.user._id },
            { "$pull": { "cart": { "id": req.query._id } } },
            { new: true }
        );

        const cart = userInfo.cart;
        const array = cart.map(item => item.id);

        const cartDetail = await Product.find({ '_id': { $in: array } }).populate('writer');
        return res.status(200).json({
            cartDetail,
            cart
        });
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.post('/successBuy', auth, async (req, res) => {
    try {
        let history = [];
        req.body.cartDetail.forEach((item) => {
            history.push({
                dateOfPurchase: Date.now(),
                name: item.title,
                id: item._id,
                price: item.price,
                quantity: item.quantity,
                paymentId: req.body.paymentData.paymentID
            });
        });

        let transactionData = {};
        transactionData.user = {
            id: req.user._id,
            name: req.user.name,
            lastname: req.user.lastname,
            email: req.user.email
        };
        transactionData.data = req.body.paymentData;
        transactionData.product = history;

        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            { $push: { history: { $each: history } }, $set: { cart: [] } },
            { new: true }
        );

        const payment = new Payment(transactionData);
        const doc = await payment.save();

        let products = doc.product.map(item => {
            return Product.updateOne(
                { _id: item.id },
                { $inc: { "sold": item.quantity } }
            );
        });

        await Promise.all(products);

        res.status(200).json({
            success: true,
            cart: user.cart,
            cartDetail: []
        });
    } catch (err) {
        return res.json({ success: false, err });
    }
});

router.get('/getHistory', auth, async (req, res) => {
    try {
        const doc = await User.findOne({ _id: req.user._id });
        let history = doc.history;
        return res.status(200).json({ success: true, history });
    } catch (err) {
        return res.status(400).send(err);
    }
});

//=================================
//      Admin: Get All Users
//=================================
router.get("/getAllUsers", auth, async (req, res) => {
    try {
        // Security Check: Kick out anyone who isn't an Admin (role === 1)
        if (req.user.role !== 1) {
            return res.status(403).json({ 
                success: false, 
                message: "Access denied. Admin privileges required." 
            });
        }

        // Fetch all users, but explicitly exclude the password field
        const users = await User.find().select('-password').exec();
        return res.status(200).json({ success: true, users });
        
    } catch (err) {
        return res.status(400).json({ success: false, err });
    }
});

module.exports = router;
