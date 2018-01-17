const Server = require("./server")

;(async () => {
  try {
    await Server.start()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
