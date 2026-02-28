const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const applicationController = require("../controllers/applicationController");


router.get("/home", authenticate, applicationController.Home);
router.get("/sort", authenticate, applicationController.sortEvents);
router.post("/edit", authenticate, applicationController.addApplication);
router.patch(
  "/update/:applicationId",
  authenticate,
  applicationController.updateApplication,
);
router.delete(
  "/delete/:applicationId",
  authenticate,
  applicationController.deleteApplication,
);

module.exports = router;
