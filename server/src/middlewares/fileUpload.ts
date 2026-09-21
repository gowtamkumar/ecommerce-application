import multer from 'multer';

// Store uploaded files in memory; the controller pushes the buffer to MinIO
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, callback: any) => {
  const imagePattern = /(jpg|jpeg|png|webp)/gi;
  const mathExt = (file.originalname.split('.').pop() || '').replace('.', '');

  if (!imagePattern.test(mathExt)) {
    return callback(new Error('Error: Images only! (jpeg, jpg, png, webp)'), null);
  }
  return callback(null, true);
};

export const upload = multer({
  limits: {
    fileSize: (Number(process.env.MAX_FILE_UPLOAD) || 5) * 1024 * 1024,
  },
  storage: storage,
  fileFilter: fileFilter,
});
