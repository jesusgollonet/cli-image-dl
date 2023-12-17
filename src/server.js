import { Liquid } from "liquidjs";
import pkg from "@fastify/static";
const { default: staticPlugin } = pkg;
import fv from "@fastify/view";
import Fastify from "fastify";
import path from "path";

import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// this is a server that in principle just serves a gallery of thephotos it has received
// it can be passed a function that given a page number, returns an array of urls to display
// on the gallery
export async function CreateServer(populatePageFunction) {
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

  fastify.register(staticPlugin, {
    root: path.join(__dirname, "./../public"),
  });

  fastify.get("/gallery/:page?", async (request, reply) => {
    const { page } = request.params || 1;
    const images = await populatePageFunction(page);
    console.log(images);
    return reply.view("./templates/index.liquid", {
      images,
    });
  });

  try {
    return fastify.listen({ port: 3001 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
