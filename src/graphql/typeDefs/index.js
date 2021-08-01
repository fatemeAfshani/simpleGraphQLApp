import post from "./post";
import user from "./user";
import gql from "graphql-tag";

const root = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`;

export default [post, root, user];
