import multer from "multer";


const storage =
  multer.memoryStorage();


export const upload = multer({
  storage,

  limits: {
    fileSize:
      500 * 1024 * 1024,
  },
});


export const uploadAvatarFile =
  multer({
    storage,

    limits: {
      fileSize:
        5 * 1024 * 1024,
    },

    fileFilter: (
      req,
      file,
      cb
    ) => {

      if (
        file.mimetype ===
          "image/jpeg" ||
        file.mimetype ===
          "image/png" ||
        file.mimetype ===
          "image/webp"
      ) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Faqat JPG, PNG yoki WEBP rasm yuklash mumkin."
          )
        );
      }
    },
  });