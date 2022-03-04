import express from "express";
import ItemSerializer from "../../../serializers/ItemSerializer.js";
import { ValidationError } from "objection";
import cleanUserInput from "../../../services/cleanUserInput.js";
import { Item, Category, User } from "../../../models/index.js";
import uploadImage from "../../../services/uploadImage.js";

const itemsRouter = new express.Router();

itemsRouter.get("/", async (req, res) => {
  const currentUserId = req.user.id;

  try {
    const items = await Item.query().where("userId", currentUserId);
    const serializedItems = await ItemSerializer.getItemCollectionDetails(items);
    return res.status(200).json({ items: serializedItems });
  } catch (err) {
    return res.status(500).json({ errors: err });
  }
});

itemsRouter.get("/:id", async (req, res) => {
  const currentUserId = req.user.id;
  const itemId = req.params.id;

  try {
    const item = await Item.query().findById(itemId).where("userId", currentUserId);
    const serializedItem = await ItemSerializer.getItemDetail(item);
    return res.status(200).json({ item: serializedItem });
  } catch (err) {
    return res.status(500).json({ errors: err });
  }
});

itemsRouter.post("/", uploadImage.single("image"), async (req, res) => {
  try {
    const { file } = req;

    const formInput = {
      ...cleanUserInput(req.body),
      image: file ? file.location : null,
    };

    const newItem = await Item.query().insertAndFetch(formInput);
    const serializedNewItem = await ItemSerializer.getItemDetail(newItem);
    return res.status(201).json({ item: serializedNewItem });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data });
    } else {
      console.log(error);
      res.status(500).json({ errors: error });
    }
  }
});

itemsRouter.delete("/:id", async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.id;
  try {
    await Item.query().findById(itemId).delete().where("userId", userId);
    return res.status(201).json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
});

itemsRouter.patch("/:id", uploadImage.single("image"), async (req, res) => {
  const itemId = req.params.id;
  const user = req.user;
  try {
    const { file } = req;
    if (req.body.roomId === "" || !req.body.roomId) {
      delete req.body.roomId;
    }

    const formInput = {
      ...req.body,
      image: file ? file.location : null,
    };
    const updatedItem = await Item.query().patchAndFetchById(itemId, formInput);
    const serializedUpdatedItem = await ItemSerializer.getItemDetail(updatedItem);
    return res.status(201).json({ item: serializedUpdatedItem });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data });
    } else {
      console.log(error);
      res.status(500).json({ errors: error });
    }
  }
});

export default itemsRouter;
