const router = require('express').Router();
const multer = require('multer');
const UserController = require('../controller/user.controller');

router.post('/registration', UserController.registerUser);

router.post('/login', UserController.loginUser);

router.post('/changePassword', UserController.changePassword);

router.post('/verify-otp', UserController.verifyOtp);

router.post('/resend-otp', UserController.resendOtp);

router.post('/updateProfile', UserController.setupProfile);
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); 

router.post('/uploads', upload.single('profilePic'), UserController.setupProfile);

router.post('/requestPasswordReset', UserController.requestPasswordReset);

router.post('/verifyResetOtp', UserController.verifyResetOtp);

router.post('/resetPassword', UserController.resetPassword);





module.exports = router;
