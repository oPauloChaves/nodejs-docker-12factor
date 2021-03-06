require("dotenv").config()
const Hapi = require("hapi")
const Inert = require("inert")
const Good = require("good")
const Boom = require("boom")
const Config = require("./config")
const { uploader, imageFilter } = require("./utils")

const fileOptions = {
  dest: `${Config.rootDir}/uploads`,
  fileFilter: imageFilter,
}

const GetCatsRoute = {
  method: "GET",
  path: "/cats/{path*}",
  handler(request, h) {
    return h.file(`uploads/${request.params.path}`)
  },
}

const UploadRoute = {
  method: "POST",
  path: "/upload",
  options: {
    async handler(request, h) {
      try {
        const { image } = request.payload
        return await uploader(image, fileOptions)
      } catch (err) {
        return Boom.badRequest(err.message, err)
      }
    },
    payload: {
      output: "stream",
      parse: true,
      allow: "multipart/form-data",
      // maxBytes: 104857600, // 100MB
    },
  },
}

async function start() {
  const server = new Hapi.Server(Config.server.options)

  await server.register([
    Inert,
    {
      plugin: Good,
      options: Config.logging,
    },
  ])

  server.route([GetCatsRoute, UploadRoute])

  await server.start()
  server.log("info", `Server started → ${server.info.uri}`)
}

module.exports = { start }
