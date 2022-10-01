const middlewareController = require("../controllers/middlewareController");
const newsController = require("../controllers/newsController");
const Post = require("../models/Post");

const router = require("express").Router();

//GET NEWS
router.get("/",
        middlewareController.verifyToken,
        middlewareController.paginatedResult(Post),
        newsController.getHotNews);

module.exports = router;
