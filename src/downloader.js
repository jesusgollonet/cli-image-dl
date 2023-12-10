import fs from "node:fs";
import https from "https";
import dotenv from "dotenv";
dotenv.config();
import { createFlickr } from "flickr-sdk";

const { flickr } = createFlickr(process.env.FLICKR_API_KEY);

export async function getPhotosForTags(tags, page = 1) {
  return await flickr("flickr.photos.search", {
    tags,
    tag_mode: "all",
    extras: ["url_m", "tags"],
    per_page: 500,
    page,
  });
}

export async function downloadFile(url, dest) {
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
