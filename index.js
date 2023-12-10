#!/usr/bin/env node

import { getPhotosForTags, downloadFile } from "./src/downloader.js";
import { CreateServer } from "./src/server.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
const tags = ["bmx", "skatepark", "-scooter"];

function createGalleryFunction(tags) {
  return async function (page) {
    const res = await getPhotosForTags(tags, page);
    return res.photos.photo.map((p) => p.url_m);
  };
}

//yargs(hideBin(process.argv))
//.scriptName("pirate-parser")
//.usage("$0 <cmd> [args]")
//.command(
//"hello [name]",
//"welcome ter yargs!",
//(yargs) => {
//yargs.positional("name", {
//type: "string",
//default: "Cambi",
//describe: "the name to say hello to",
//});
//},
//function (argv) {
//console.log("hello", argv.name, "welcome to yargs!");
//},
//)
//.help().argv;
yargs(hideBin(process.argv))
  .scriptName("flickr")
  .usage("$0 <cmd> [args]")
  .command(
    "search",
    "search for photos with the given tag",
    (yargs) => {
      console.log("hey");
      yargs.positional("tags", {
        array: true,
        demandOption: false,
      });
    },
    (argv) => {
      console.log("heiy");
      const { tags } = argv;
      if (tags) {
        console.log("we have tags!", tags);
        const populatePageFunction = createGalleryFunction(tags);
        CreateServer(populatePageFunction);
      } else {
        console.log("no tags!");
      }
    },
  )
  .help()
  .alias("h", "help").argv;
