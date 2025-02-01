import multer from 'multer';

const storage = multer.memoryStorage();

// Configure multer
export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
    }
  }
});

export const docUpload = multer({ 
  storage: storage, 
  limits: {
    fileSize: 5 * 1024 * 1024,  
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); 
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);  
    }
  }
});
