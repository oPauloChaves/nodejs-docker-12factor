require("dotenv").config()
const Hapi = require("hapi")
const Inert = require("inert")
const Good = require("good")
const Config = require("./config")

async function start() {
  const server = new Hapi.Server(Config.server.options)

  await server.register([
    Inert,
    {
      plugin: Good,
      options: Config.logging,
    },
  ])

  server.route({
    method: "GET",
    path: "/cats/{path*}",
    handler(request, h) {
      const { path } = request.params
      return h.file(path)
    },
  })

  await server.start()
  server.log("info", `Server started → ${server.info.uri}`)
}

module.exports = { start }
