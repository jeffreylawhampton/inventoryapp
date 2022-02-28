import express from "express";
import userSessionsRouter from "./api/v1/userSessionsRouter.js";
import usersRouter from "./api/v1/usersRouter.js";
import clientRouter from "./clientRouter.js";
import itemsRouter from "./api/v1/itemsRouter.js";
import categoriesRouter from "./api/v1/categoriesRouter.js";
import roomsRouter from "./api/v1/roomsRouter.js";

const rootRouter = new express.Router();
rootRouter.use("/", clientRouter);

rootRouter.use("/api/v1/user-sessions", userSessionsRouter);
rootRouter.use("/api/v1/users", usersRouter);
rootRouter.use("/api/v1/items", itemsRouter);
rootRouter.use("/api/v1/categories", categoriesRouter);
rootRouter.use("/api/v1/rooms", roomsRouter);

export default rootRouter;
