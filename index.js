import { getPhotosForTags, downloadFile } from "./src/downloader.js";
import { CreateServer } from "./src/server.js";

const tags = ["bmx", "skatepark", "-scooter"];

const res = await getPhotosForTags(tags, 1);
const allPhotos = res.photos.photo;

//for (const photo of allPhotos) {
//const url = photo.url_m;
//const dest = `./images/${photo.id}.jpg`;
//await downloadFile(url, dest);
//}

CreateServer(allPhotos.map((p) => p.url_m));
