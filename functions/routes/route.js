const express = require("express");
const router = express.Router();
const { test, uploadImage, updateMetadata} = require('../controllers/imageController');

router.get("/", test);
router.get("/uploadImage", uploadImage);
router.get("/updateMetadata", updateMetadata);

module.exports = router;