import gql from "graphql-tag";

export default gql`
  extend type Query {
    imageInfo: String!
  }

  extend type Mutation {
    uploadImage(file: Upload!): String!
  }
`;

//not using it
