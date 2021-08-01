import { ApolloError } from "apollo-server-express";
import bcrypt from "bcryptjs";
import { pick } from "lodash";
import { generateToken } from "../../functions/userUtils";

import {
  UserRegisterationRules,
  UserAuthenticationRules,
} from "../../validators/user";
export default {
  Query: {
    userInfo(_, context, { user }) {
      try {
        if (!user) {
          throw new ApolloError("please authenticate first");
        }

        return user;
      } catch (err) {
        return new ApolloError(err.message, 400);
      }
    },
  },

  Mutation: {
    async createUser(_, { data }, { User }) {
      try {
        await UserRegisterationRules.validate(
          {
            username: data.username,
            password: data.password,
            email: data.email,
          },
          { abortEarly: false }
        );
        const isEmailToken = await User.findOne({ email: data.email });
        if (isEmailToken) {
          throw new ApolloError("email exist");
        }
        const isUsernameToken = await User.findOne({ username: data.username });
        if (isUsernameToken) {
          throw new ApolloError("username exist");
        }
        const password = await bcrypt.hash(data.password, 10);
        const user = new User({
          username: data.username,
          email: data.email,
          avatar: data.avatar,
          password,
        });

        const savedUser = await user.save();

        const wantedUserData = pick(savedUser, ["username", "email", "id"]);

        const token = await generateToken(wantedUserData);
        return {
          token,
          user: wantedUserData,
        };
      } catch (err) {
        const message = err.errors ? err.errors[0] : err.message;

        return new ApolloError(message, 400);
      }
    },
    async signin(
      _,
      { username, password },
      { User, req, isAuth, user: ReqUser }
    ) {
      try {
        await UserAuthenticationRules.validate(
          { username, password },
          { abortEarly: false }
        );
        const user = await User.findOne({ username });
        if (!user) {
          throw new ApolloError("user not found");
        }
        const isPassMatch = await bcrypt.compare(password, user.password);
        if (!isPassMatch) {
          throw new ApolloError("wrong password");
        }

        const wantedUserData = pick(user, ["username", "email", "id"]);

        const token = await generateToken(wantedUserData);

        return {
          token,
          user: wantedUserData,
        };
      } catch (err) {
        const message = err.errors ? err.errors[0] : err.message;

        return new ApolloError(err.message, 404);
      }
    },
  },
};
