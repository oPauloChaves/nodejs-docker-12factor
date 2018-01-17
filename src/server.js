require("dotenv").config()
const Hapi = require("hapi")
const Inert = require("inert")
const Good = require("good")
const Config = require("./config")
const Utils = require("./utils")

const fileOptions = {
  dest: Config.server.options.routes.files.relativeTo,
}

const GetCatsRoute = {
  method: "GET",
  path: "/cats/{path*}",
  handler(request, h) {
    const { path } = request.params
    return h.file(path)
  },
}

const UploadRoute = {
  method: "POST",
  path: "/upload",
  options: {
    async handler(request, h) {
      const { image } = request.payload

      const fileDetails = await Utils.uploader(image, fileOptions)

      return fileDetails
    },
    payload: {
      output: "stream",
      parse: true,
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
