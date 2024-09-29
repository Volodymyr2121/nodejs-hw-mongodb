import multer from "multer";
import { TEMP_UPLOAD_DIR } from "../constant/index.js";
import createHttpError from "http-errors";

const storage = multer.diskStorage({
    destination: TEMP_UPLOAD_DIR,
    filename: (req, file, callback) => {
        const uniqePriffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniqePriffix}_${file.originalname}`;
        callback(null, filename);
    },
    
});

const limits = {
    fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => { 
    const extension = file.originalname.split(".").pop();
    if (extension === "exe") {
        return callback(createHttpError(400, ".exe not vali extension"));
    }
    callback(null, true);
};

const upload = multer({
    storage,
    limits,
    fileFilter
});

export default upload;