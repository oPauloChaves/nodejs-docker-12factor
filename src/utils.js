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
 * @param {Object} options - The configurable options
 * @param {string} options.dest - The destination path
 * @param {function} [options.fileFilter] - The function used to filter files by type
 *
 * @return {Promise[]}
 */
function filesHandler(files, options) {
  if (!files || !Array.isArray(files)) throw new Error("No files")

  if (options.fileFilter) {
    const filenames = getFilenames(getInvalidFiles(files, options.fileFilter))
    if (filenames.length) {
      throw new Error(`File type not allowed: ${filenames.join(", ")}`)
    }
  }

  return Promise.all(files.map(file => fileHandler(file, options)))
}

/**
 * Upload a single file
 *
 * @param {ReadableStream} file
 * @param {Object} options - The configurable options
 * @param {string} options.dest - The destination path
 * @param {function} [options.fileFilter] - The function used to filter files by type
 *
 * @return {Promise} File details
 */
function fileHandler(file, { dest }) {
  if (!file) throw new Error("no file")

  const { filename: originalname } = file.hapi
  const extname = path.extname(originalname)
  const filename = `${uuid.v1()}${extname}`
  const filepath = `${dest}/${filename}`
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
        destination: `${dest}`,
        path: filepath,
        size: fs.statSync(filepath).size,
      })
    })
  })
}

/**
 * Filter a file by type. The default allowed types are jpg, jpeg, png and gif
 *
 * @param {string} fileName
 * @param {string[]} [types=['jpg', 'jpeg', 'png', 'gif']] List of allowed file types
 *
 * @return {boolean} `true` if the type of the filename is allowed, `false` otherwise
 */
function fileFilter(fileName, types = ["jpg", "jpeg", "png", "gif"]) {
  const regex = RegExp(`.(${types.join("|")})$`, "i")
  return Boolean(fileName.match(regex))
}

function getInvalidFiles(files, fileFilter) {
  return files.filter(({ hapi: { filename } }) => !fileFilter(filename))
}

function getFilenames(files) {
  return files.map(({ hapi: { filename } }) => filename)
}

module.exports = {
  uploader,
  imageFilter: fileFilter,
}
