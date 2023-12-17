#!/usr/bin/env node

import { getPhotosForTags } from "./src/downloader.js";
import { CreateServer } from "./src/server.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import open from "open";

function createGalleryFunction(tags) {
  return async function (page) {
    const res = await getPhotosForTags(tags, page);
    return res.photos.photo.map((p) => p.url_m);
  };
}

yargs(hideBin(process.argv))
  .scriptName("flickr")
  .usage("$0 <cmd> [args]")
  .command(
    "search",
    "search for photos with the given tag",
    (yargs) => {
      yargs.positional("tags", {
        array: true,
        demandOption: false,
      });
    },
    async (argv) => {
      const { tags } = argv;
      if (tags) {
        console.log(tags);
        const populatePageFunction = createGalleryFunction(tags);
        await CreateServer(populatePageFunction);
        open("http://localhost:3001/gallery", { wait: true });
        console.log("after server");
      } else {
        console.log("no tags!");
      }
    },
  )
  .help()
  .alias("h", "help").argv;
