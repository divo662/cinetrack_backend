const router = require('express').Router();
const ColorController = require('../controller/color.controller');

router.post('/extract-colors', ColorController.extractColors);

module.exports = router;
