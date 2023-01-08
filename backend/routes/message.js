const router = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const messageController = require("../controllers/messageController");
const upload = require("../utils/multer");

//CREATE A MESSAGE
router.post(
  "/",
  middlewareController.verifyToken,
  messageController.createMessage
);
//CREATE A MESSAGE FORM DATA
router.post(
    "/form-data",
    upload.single("image"),
    middlewareController.verifyToken,
    messageController.createMessageFileLoad);

//GET MESSAGE
router.get(
  "/:conversationId",
  middlewareController.verifyToken,
  messageController.getMessage
);

module.exports = router;
