const fs = require("fs")
const path = require("path")
const uuid = require("uuid")

const uploader = function(file, options) {
  if (!file) throw new Error("no file(s)")

  return fileHandler(file, options)
}

const fileHandler = function(file, options) {
  if (!file) throw new Error("no file")

  const originalname = file.hapi.filename
  const extname = path.extname(originalname)
  const filename = `${uuid.v1()}${extname}`
  const filepath = `${options.dest}/${filename}`
  const fileStream = fs.createWriteStream(filepath)

  return new Promise((resolve, reject) => {
    file.on("error", function(err) {
      reject(err)
    })

    file.pipe(fileStream)

    file.on("end", function(err) {
      const fileDetails = {
        fieldname: file.hapi.name,
        originalname,
        filename,
        mimetype: file.hapi.headers["content-type"],
        destination: `${options.dest}`,
        path: filepath,
        size: fs.statSync(filepath).size,
      }

      resolve(fileDetails)
    })
  })
}

module.exports = { uploader }
