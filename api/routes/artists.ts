import express from "express";
import Artist from "../models/Artist";
import {imagesUpload} from "../multer";

const artistsRouter = express.Router();

artistsRouter.get('/', imagesUpload.single('image'), async (req, res, next) => {
    try {
        const artists = await Artist.find();
        res.send(artists);
    } catch (e) {
        next(e);
    }
});

artistsRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
    try {
        const { name, info } = req.body;

        if (!name) {
            res.send({ error: 'Name is required' });
        }

        const newArtist = {
            name,
            image: req.file ? `images/${req.file.filename}` : null,
            info: info || null,
        };

        const newArtistData = new Artist(newArtist);
        await newArtistData.save();
        res.send(newArtistData);
    } catch (e) {
        next(e);
    }
});



export default artistsRouter;