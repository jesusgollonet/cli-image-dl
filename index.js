import fs from "node:fs";
import https from "https";
import { Liquid } from "liquidjs";
import fv from "@fastify/view";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import * as url from "url";

import { createFlickr } from "flickr-sdk";
import Fastify from "fastify";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const fastify = Fastify({
  logger: true,
});

const engine = new Liquid({
  root: path.join(__dirname, "templates"),
  extname: ".liquid",
});

fastify.register(fv, {
  engine: {
    liquid: engine,
  },
});

const { flickr } = createFlickr(process.env.FLICKR_API_KEY);
const res = await getPhotosForTags(["bmx", "skatepark", "-scooter"], 1);
const allPhotos = res.photos.photo;

fastify.get("/", async (request, reply) => {
  return reply.view("./templates/index.liquid", {
    images: allPhotos.map((p) => p.url_m),
  });
});

try {
  await fastify.listen({ port: 3001 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

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
