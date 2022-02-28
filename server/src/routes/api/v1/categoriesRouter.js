import express from "express";
import { ValidationError } from "objection";
import cleanUserInput from "../../../services/cleanUserInput.js";
import CategorySerializer from "../../../serializers/CategorySerializer.js";
import { Category } from "../../../models/index.js";

const categoriesRouter = new express.Router();

categoriesRouter.get("/", async (req, res) => {
  const currentUserId = req.user.id;

  try {
    const categories = await Category.query().where("userId", currentUserId);
    const serializedCategories = await CategorySerializer.getCategoryCollectionDetails(categories);
    return res.status(200).json({ categories: serializedCategories });
  } catch (err) {
    return res.status(500).json({ errors: err });
  }
});

categoriesRouter.get("/:id", async (req, res) => {
  const currentUserId = req.user.id;
  const categoryId = req.params.id;

  try {
    const category = await Category.query().findById(categoryId).where("userId", currentUserId);
    const serializedCategory = await CategorySerializer.getCategoryDetails(category);
    return res.status(200).json({ category: serializedCategory });
  } catch (err) {
    return res.status(500).json({ errors: err });
  }
});

categoriesRouter.patch("/:id", async (req, res) => {
  const categoryId = req.params.id;
  const user = req.user;
  const { name, id, color } = req.body;

  try {
    const updatedCategory = await Category.query().patchAndFetchById(categoryId, {
      name: name,
      color: color,
    });
    const serializedCategory = await CategorySerializer.getCategoryDetails(updatedCategory);
    return res.status(200).json({ category: serializedCategory });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
});

categoriesRouter.post("/", async (req, res) => {
  const userId = req.user.id;

  try {
    const formInput = cleanUserInput(req.body);
    formInput.userId = userId;
    const category = await Category.query().insertAndFetch(formInput);
    return res.status(201).json({ category });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data });
    } else {
      res.status(500).json({ errors: error });
    }
  }
});

categoriesRouter.delete("/:id", async (req, res) => {
  const userId = req.user.id;
  const categoryId = req.params.id;
  try {
    await Category.query().findById(categoryId).delete().where("userId", userId);
    return res.status(201).json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
});

export default categoriesRouter;
