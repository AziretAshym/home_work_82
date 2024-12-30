import express from 'express';
import * as mongoose from "mongoose";
import MongoDb from "./mongoDb";
import artistsRouter from "./routes/artists";
import albumsRouter from "./routes/albums";

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));


app.use('/artists', artistsRouter);
app.use('/albums', albumsRouter);

const run = async () => {
    await mongoose.connect('mongodb://localhost/spotify');
    app.listen(port, () => {
        console.log(`Server started on port http://localhost:${port}`);
    });
    process.on('exit', () => {
        MongoDb.disconnect();
    })

};

run().catch((e) => console.error(e));
