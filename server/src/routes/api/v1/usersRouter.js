import express from "express";
import passport from "passport";
import { User } from "../../../models/index.js";
import objection from "objection";
import cleanUserInput from "../../../services/cleanUserInput.js";
import UserSerializer from "../../../serializers/UserSerializer.js";
import CategorySerializer from "../../../serializers/CategorySerializer.js";

const { ValidationError } = objection;

const usersRouter = new express.Router();

usersRouter.post("/", async (req, res) => {
  const { name, email, password, passwordConfirmation } = req.body;
  try {
    const persistedUser = await User.query().insertAndFetch({ name, email, password });
    return req.login(persistedUser, () => {
      return res.status(201).json({ user: persistedUser });
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ errors: error });
  }
});

usersRouter.get("/:id", async (req, res) => {
  const userId = req.params.id;
  const loggedInUserId = req.user.id;
  try {
    if (userId !== loggedInUserId) {
      const errorMessage = "Not this time buddy";
      throw errorMessage;
    }
    const user = await User.query().findById(userId);
    const serializedUser = await UserSerializer.getUserOverview(user);

    return res.status(200).json({ user: serializedUser });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
});

export default usersRouter;
