import express from "express";

const PORT = 3000;

const setupServer = express();

setupServer.listen(PORT, () => {
    console.log(`Server is running of PORT ${PORT}`);
});