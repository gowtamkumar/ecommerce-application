import multer from "multer";
import path, { extname, resolve } from "path";

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, callback: any) => {
    if (!file) return callback(new Error("Upload file error"), null);
    return callback(null, 'public/uploads');
  },

  filename: (req: any, file, callback: any) => {
    if (file) {
      const imagePattern = /(jpg|jpeg|png)/gi;
      const mathExt = extname(file.originalname).replace(".", "");

      if (!imagePattern.test(mathExt)) {
        return callback(
          new Error("Error: Images only! (jpeg, jpg, png)"),
          null
        );
      }
      const imageName =
        file.fieldname + "-" + Date.now() + path.extname(file.originalname);
      return callback(null, imageName);
    }
  },
});

// const fileFilter = (req,file,callback) => {
//   const supportedFiles = ['image/jpeg', 'image/png'];
//   if (supportedFiles.includes(file.mimetype)) {
//     return callback(null, true);
//   } else {
//     //reject file
//     return callback('Unsupported file format', false);
//   }
// };

export const upload = multer({
  limits: {
    fileSize: (Number(process.env.MAX_FILE_UPLOAD) || 5) * 1024 * 1024,
  },
  storage: storage,
});
