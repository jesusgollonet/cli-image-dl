import { Liquid } from "liquidjs";
import pkg from "@fastify/static";
const { default: staticPlugin } = pkg;
import fv from "@fastify/view";
import Fastify from "fastify";
import path from "path";

import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// this is a server that in principle just serves a gallery of thephotos it has received
export async function CreateServer(allPhotos) {
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

  fastify.get("/gallery", async (_, reply) => {
    return reply.view("./templates/index.liquid", {
      images: allPhotos,
    });
  });

  fastify.get("/gallery/:page", async (request, reply) => {
    const { page } = request.params;
    const res = await getPhotosForTags(tags, page);
    const images = res.photos.photo.map((p) => p.url_m);
    return reply.view("./templates/index.liquid", {
      images,
    });
  });

  try {
    await fastify.listen({ port: 3001 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
