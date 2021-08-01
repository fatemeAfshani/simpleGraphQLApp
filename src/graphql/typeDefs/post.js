import gql from "graphql-tag";

export default gql`
  extend type Query {
    getAllPosts: [Post!]!
    getPost(id: ID!): Post!
    getPostsPaginated(page: Int, limit: Int): PaginatedPosts!
  }

  extend type Mutation {
    createPost(data: newPostInput!): Post!
    updatePost(data: updatePostInput, id: ID!): Post!
    deletePost(id: ID!): deleteInformation!
  }

  input newPostInput {
    title: String!
    content: String!
    featureImage: String
  }

  input updatePostInput {
    title: String
    content: String
    featureImage: String
  }

  type deleteInformation {
    id: ID!
    success: Boolean!
    message: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    featureImage: String
    createdAt: String
    updatedAt: String
    author: User!
  }

  type Paginator {
    postsCount: Int!
    perPage: Int!
    currentPage: Int!
    next: Int
    prev: Int
    pageCount: Int!
    slNo: Int
    hasPrevPage: Boolean!
    hasNextPage: Boolean!
  }

  type PaginatedPosts {
    posts: [Post!]!
    paginator: Paginator
  }
`;
