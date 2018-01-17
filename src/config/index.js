const common = require("./common")
const server = require("./server")
const logging = require("./logging")

module.exports = {
  ...common,
  server: server(common),
  logging: logging(common),
}
