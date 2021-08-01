import gql from "graphql-tag";

export default gql`
  extend type Query {
    userInfo: User!
  }

  extend type Mutation {
    createUser(data: UserInput!): AuthUser!
    signin(username: String!, password: String!): AuthUser!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
    avatar: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
  }

  type AuthUser {
    user: User!
    token: String!
  }
`;
