import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from "./constant/index.js";
import createDirIfNotExists from "./utils/createDirIfNotExists.js";

const bootstrap  = async () => {
    initMongoConnection();
    await setupServer();
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);
};

bootstrap();