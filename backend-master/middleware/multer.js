import multer from 'multer';
import { diskStorage } from 'multer';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';


const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

const customMulter = (destinationPath) => {
  return multer({
    storage: diskStorage({
      destination: (req, file, callback) => {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        callback(null, join(__dirname, "../public/images/" + destinationPath));
      },
      filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];

        callback(null, Date.now() + "_" + name + '.' + extension); // Include extension
      },
    }),
    limits: 10 * 1024 * 1024, // Set a limit on file size (optional)
  }).single("avatar"); // Field name matches front-end form
};

export default customMulter; // Export the customMulter function