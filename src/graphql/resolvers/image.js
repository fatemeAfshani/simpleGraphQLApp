import { join, parse } from "path";
import { createWriteStream } from "fs";
import { BASE_URL } from "../../config";

//not using it

export default {
  Query: {
    imageInfo() {
      return "image info";
    },
  },

  Mutation: {
    async uploadImage(_, { file }) {
      const { filename, createReadStream } = await file;

      let stream = createReadStream();

      let { ext, name } = parse(filename);

      name = name.replace(/([^a-z0-9 ]+)/gi, "-").replace(" ", "_");

      let serverFile = join(
        __dirname,
        `../../uploads/${name}-${Date.now()}${ext}`
      );

      serverFile = serverFile.replace(" ", "_");

      let writeStream = await createWriteStream(serverFile);

      await stream.pipe(writeStream);

      serverFile = `${BASE_URL}${serverFile.split("uploads")[1]}`;

      return serverFile;
    },
  },
};
