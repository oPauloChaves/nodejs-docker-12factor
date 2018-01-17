const fs = require("fs")
const path = require("path")
const uuid = require("uuid")

/**
 * Upload one or multiple files.
 *
 * @param {(ReadableStream|ReadableStream[])} file
 * @param {Object} options
 *
 * @return {Promise[]} a list of promises that contains the details of uploaded file
 */
const uploader = function(file, options) {
  if (!file) throw new Error("no file(s)")
  return filesHandler([].concat(file), options)
}

/**
 * Upload a list of files
 *
 * @param {ReadableStream[]} files
 * @param {object} options
 *
 * @return {Promise[]}
 */
function filesHandler(files, options) {
  if (!files || !Array.isArray(files)) throw new Error("No files")

  return Promise.all(files.map(file => fileHandler(file, options)))
}

/**
 * Upload a single file
 *
 * @param {ReadableStream} file
 * @param {object} options
 */
function fileHandler(file, options) {
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
      resolve({
        fieldname: file.hapi.name,
        originalname,
        filename,
        mimetype: file.hapi.headers["content-type"],
        destination: `${options.dest}`,
        path: filepath,
        size: fs.statSync(filepath).size,
      })
    })
  })
}

module.exports = { uploader }
