#!/usr/bin/env node

import { getPhotosForTags } from "./src/downloader.js";
import { CreateServer } from "./src/server.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

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
    (argv) => {
      const { tags } = argv;
      if (tags) {
        const populatePageFunction = createGalleryFunction(tags);
        CreateServer(populatePageFunction);
      } else {
        console.log("no tags!");
      }
    },
  )
  .help()
  .alias("h", "help").argv;
