import { ApolloError } from "apollo-server-express";
import { NewPostRules } from "../../validators/post";

const myCustomLabels = {
  totalDocs: "postsCount",
  docs: "posts",
  limit: "perPage",
  page: "currentPage",
  nextPage: "next",
  prevPage: "prev",
  totalPages: "pageCount",
  pagingCounter: "slNo",
  meta: "paginator",
};

export default {
  Query: {
    async getAllPosts(_, args, { Post, user }) {
      try {
        if (!user) {
          throw new ApolloError("please authenticate");
        }
        const posts = await Post.find().populate("author");

        return posts;
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
    async getPost(_, { id }, { Post, user }) {
      try {
        if (!user) {
          throw new ApolloError("please authenticate");
        }

        const post = await Post.findById(id).populate("author");
        if (!post) {
          throw new ApolloError("post not found");
        }
        return post;
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },

    async getPostsPaginated(_, { page, limit }, { Post }) {
      const options = {
        page: page || 1,
        limit: limit || 10,
        sort: { createdAt: -1 },
        populate: "author",
        customLabels: myCustomLabels,
      };

      const posts = await Post.paginate({}, options);
      return posts;
    },
  },
  Mutation: {
    async createPost(_, { data }, { Post, user }, info) {
      try {
        await NewPostRules.validate(
          { content: data.content, title: data.title },
          { abortEarly: false }
        );
        if (!user) {
          throw new ApolloError("please authenticate");
        }

        const post = await new Post({ ...data, author: user._id });
        await post.save();
        await post.populate("author").execPopulate();

        return post;
      } catch (err) {
        const message = err.errors ? err.errors[0] : err.message;
        throw new ApolloError(message);
      }
    },

    async updatePost(_, { data, id }, { Post, user }, info) {
      try {
        if (data.content && data.title) {
          await NewPostRules.validate(
            { content: data.content, title: data.title },
            { abortEarly: false }
          );
        }
        if (!user) {
          throw new ApolloError("please authenticate");
        }
        const updatedPost = await Post.findOneAndUpdate(
          { _id: id, author: user._id },
          { ...data }
        );
        if (!updatedPost) {
          throw new ApolloError("unable to update post");
        }
        await updatedPost.populate("author").execPopulate();
        return updatedPost;
      } catch (err) {
        const message = err.errors ? err.errors[0] : err.message;

        throw new ApolloError(message);
      }
    },

    async deletePost(_, { id }, { Post, user }) {
      try {
        if (!user) {
          throw new ApolloError("please authenticate");
        }
        const deletedPost = await Post.findOneAndDelete({
          _id: id,
          author: user._id,
        });

        if (!deletedPost) {
          throw new ApolloError("post already been deleted");
        }
        return {
          id: deletedPost.id,
          success: true,
          message: "post has been deleted",
        };
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
  },
};
