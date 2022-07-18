const express = require("express");
const router = express.Router();
const { test, uploadImage, updateMetadata} = require('../controllers/imageController');

router.get("/", test);
router.post("/uploadImage", uploadImage);
router.post("/updateMetadata", updateMetadata);

module.exports = router;