import { getPhotosForTags, downloadFile } from "./src/downloader.js";
import { CreateServer } from "./src/server.js";

const tags = ["bmx", "skatepark", "-scooter"];

const res = await getPhotosForTags(tags, 1);

function createGalleryFunction(tags) {
  return async function (page) {
    const res = await getPhotosForTags(tags, page);
    return res.photos.photo.map((p) => p.url_m);
  };
}

const populatePageFunction = createGalleryFunction(tags);
CreateServer(populatePageFunction);
