import { postController } from "../controllers/index.js";
import { Router } from "express";
import { postCreateValidation } from "../validators/auth.js";
import { checkAuth, handleValidationErrors } from "../utils/index.js";
const router = new Router();

router.get("/", postController.getAll);
router.get("/:id", postController.getOne);
router.post(
  "/",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  postController.create
);
router.post("/comments/:id", checkAuth, postController.addComments);
router.delete("/:id", checkAuth, postController.deletePost);
router.put(
  "/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  postController.updatePost
);

export default router;
