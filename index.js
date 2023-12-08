import fs from "node:fs";
import https from "https";

import dotenv from "dotenv";
dotenv.config();
import { createFlickr } from "flickr-sdk";
import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

const { flickr } = createFlickr(process.env.FLICKR_API_KEY);

//import https from "https";
//import fs from "node:fs";

async function getPhotosForTags(tag, page = 1) {
  return await flickr("flickr.photos.search", {
    tags: tag,
    tag_mode: "all",
    extras: ["url_m", "tags"],
    per_page: 10,
    page,
  });
}

const res = await getPhotosForTags(["bmx", "skatepark", "-scooter"], 1);
const allPhotos = res.photos.photo;

console.log(
  "photos",
  allPhotos.length,
  allPhotos.map((p) => p.url_m),
);

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (error) => {
        fs.unlink(dest);
        reject(error);
      });
  });
}

for (const photo of allPhotos) {
  const url = photo.url_m;
  const dest = `./images/${photo.id}.jpg`;
  await downloadFile(url, dest);
}
