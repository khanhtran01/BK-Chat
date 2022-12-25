const User = require('../models/User');
const verifyToken = require('../../util/verifyToken');
const randString = require('../../util/randString');
const mailVerify = require('../../util/mailVerify');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const saltRounds = 10;
class AuthenController {
    async checkLogin(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user && user.verify) {
                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    if (result) {
                        let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRECT, {
                            expiresIn: '8h',
                        });
                        res.status(200).json({ token: token, successful: true });
                    } else {
                        res.status(200).json({
                            message: 'Invalid email or password',
                            successful: false,
                        });
                    }
                });
            } else if (!user.verify) {
                res.status(200).json({ message: 'Your email is not verify', successful: false });
            } else {
                res.status(200).json({ message: 'Invalid email or password', successful: false });
            }
        } catch (error) {
            next(error);
        }
    }
    async storeAccount(req, res, next) {
        try {
            const user = await User.find({
                email: req.body.email,
            });
            if (user.length > 0) {
                res.status(200).json({ message: 'Email is exit', successful: false });
            } else {
                const randStr = randString();
                bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
                    await User.create({
                        email: req.body.email,
                        password: hash,
                        username: req.body.username,
                        uniqueString: randStr,
                    });
                });
                const transport = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.ADMIN_EMAIL,
                        pass: process.env.ADMIN_PASSWORD,
                    },
                });
                const mailOptions = {
                    from: `BK-Chat <${process.env.ADMIN_EMAIL}>`,
                    to: `${req.body.email}`,
                    subject: '🚀 Verify your email ✔',
                    html: mailVerify(randStr, req.body.email, process.env.FE_URL),
                };
                await transport.sendMail(mailOptions);
                res.status(200).json({ message: 'Register Successfull', successful: true });
            }
        } catch (error) {
            next(error);
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const user = await User.findOne({
                email: req.query.email,
                uniqueString: req.query.token,
            });
            if (user) {
                await User.updateOne(
                    { _id: user._id },
                    {
                        verify: true,
                    },
                );
                res.status(200).json({ successful: true });
            } else {
                res.status(200).json({ successful: false });
            }
        } catch (error) {
            next(error);
        }
    }

    logout(req, res, next) {
        res.status(200).json({ message: 'Logout', successful: true });
    }
    async checkToken(req, res, next) {
        try {
            let token = req.header('Authorization').split(' ')[1];
            let checkToken = verifyToken(token);
            const userInfor = await User.findOne({ _id: checkToken }, { password: 0 });
            res.status(200).json({ userInfor: userInfor, successful: true });
        } catch (error) {
            res.status(401).json({ message: 'Token is not valid', successful: false });
        }
    }
    async authService(req, res, next) {
        try {
            if (req.body.accessKey === process.env.JWT_SECRECT) {
                let accessKey = jwt.sign({}, process.env.JWT_SECRECT, { expiresIn: '1h' });
                res.status(200).json({ accessKey: accessKey, successful: true });
            } else {
                res.status(401).json({ successful: false });
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthenController();
