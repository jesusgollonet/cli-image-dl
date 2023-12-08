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

//const allPhotos = [];
//// async loop 1 to 10
//for (let i = 1; i <= 10; i++) {
//// Your code here
//let res = await getPhotosForTags(["bmx", "skatepark", "-scooter"], i);
//allPhotos.push(...res.photos.photo);
//}

//console.log("allPhotos", allPhotos.length, allPhotos);

//async function downloadFile(url, dest) {
//return new Promise((resolve, reject) => {
//const file = fs.createWriteStream(dest);
//https
//.get(url, (response) => {
//response.pipe(file);
//file.on("finish", () => {
//file.close();
//resolve();
//});
//})
//.on("error", (error) => {
//fs.unlink(dest);
//reject(error);
//});
//});
//}

//for (const photo of allPhotos) {
//const url = photo.url_m;
//const dest = `./images/${photo.id}.jpg`;
//await downloadFile(url, dest);
//}
