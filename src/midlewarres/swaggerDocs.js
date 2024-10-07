import swaggerUiExpress from "swagger-ui-express";
import { readFileSync } from "node:fs";
import createHttpError from "http-errors";
import { SWAGGER_PATH } from "../constant/index.js";

const swaggerDocs = () => {
    try {
         const swaggerContent = readFileSync(SWAGGER_PATH, 'utf-8');
    const swaggerData = JSON.parse(swaggerContent);

    return [...swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerData)];
    } catch {
        return (req, res, next) => next(createHttpError(500, "Cannot find swagger docs"));
    }
   
};

export default swaggerDocs;