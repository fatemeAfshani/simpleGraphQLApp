import express from "express";
import { ApolloServer } from "apollo-server-express";
import { success, error } from "consola";
import { PORT, MONGODB_URL } from "./config";
import mongoose from "mongoose";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import Post from "./models/Post";
import User from "./models/User";
import isAuth from "./middlewares/isAuth";
// import { IsAuthDirective } from "./graphql/directives/auth.directive";

const app = express();
// app.use(express.static(join(__dirname, "./uploads")));
app.use(isAuth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  // schemaDirectives: {
  //   isAuth: IsAuthDirective,
  // },
  context: ({ req }) => {
    const { isAuth, user } = req;
    return {
      req,
      isAuth,
      user,
      Post,
      User,
    };
  },
});

const createApp = async () => {
  try {
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    success({
      badge: true,
      message: `connected to db`,
    });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
      success({
        badge: true,
        message: `server is up on PORT ${PORT}`,
      });
    });
  } catch (err) {
    error({
      badge: true,
      message: err.message,
    });
  }
};

createApp();
