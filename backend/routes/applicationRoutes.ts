import express from "express";
const router = express.Router();
import authenticate from "../middleware/authenticate";
import * as applicationController from "../controllers/applicationController";

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

export default router;
