import express from "express";
import { ValidationError } from "objection";
import cleanUserInput from "../../../services/cleanUserInput.js";
import RoomSerializer from "../../../serializers/RoomSerializer.js";
import { Room } from "../../../models/index.js";

const roomsRouter = new express.Router();

roomsRouter.get("/", async (req, res) => {
  const currentUserId = req.user.id;

  try {
    const rooms = await Room.query().where("userId", currentUserId);
    const serializedRooms = await RoomSerializer.getRoomCollectionSummary(rooms);
    return res.status(200).json({ rooms: serializedRooms });
  } catch (err) {
    return res.status(500).json({ errors: err });
  }
});

roomsRouter.get("/:id", async (req, res) => {
  const currentUserId = req.user.id;
  const roomId = req.params.id;

  try {
    const room = await Room.query().findById(roomId).where("userId", currentUserId);
    const serializedRoom = await RoomSerializer.getRoomDetails(room);
    return res.status(200).json({ room: serializedRoom });
  } catch (err) {
    return res.status(500).json({ errors: err });
  }
});

roomsRouter.post("/", async (req, res) => {
  const userId = req.user.id;

  try {
    const formInput = cleanUserInput(req.body);
    formInput.userId = userId;
    const room = await Room.query().insertAndFetch(formInput);
    return res.status(201).json({ room });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data });
    } else {
      res.status(500).json({ errors: error });
    }
  }
});

roomsRouter.patch("/:id", async (req, res) => {
  const roomId = req.params.id;
  const user = req.user;
  const { name, id } = req.body;

  try {
    const updatedRoom = await Room.query().patchAndFetchById(roomId, { name: name });
    const serializedRoom = await RoomSerializer.getRoomDetails(updatedRoom);
    return res.status(200).json({ room: serializedRoom });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
});

roomsRouter.delete("/:id", async (req, res) => {
  const userId = req.user.id;
  const roomId = req.params.id;
  try {
    await Room.query().findById(roomId).delete().where("userId", userId);
    return res.status(201).json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
});

export default roomsRouter;
