import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    featureImage: {
      type: String,
    },
    author: {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

postSchema.plugin(mongoosePaginate);

const Post = model("Post", postSchema);

export default Post;
