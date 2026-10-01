import { Router } from "express";

import { getAllUsers, getMessages } from "../controller/user.controller.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/messages/:userId", getMessages);

export default router;