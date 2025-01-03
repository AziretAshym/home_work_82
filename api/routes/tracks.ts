import express from "express";
import mongoose from "mongoose";
import Album from "../models/Album";
import Track from "../models/Track";

const tracksRouter = express.Router();

tracksRouter.get("/", async (req, res, next) => {
    const albumIdQuery = req.query.album_id;

    try {
        const filter = albumIdQuery ? {album: albumIdQuery} : {};
        const track = await Track.find(filter).populate("album", "title -_id",);
        res.send(track);
    } catch (e) {
        next(e);
    }
});

tracksRouter.post('/', async (req, res, next) => {
    const { title, album, duration } = req.body;

    if (!album) {
        res.status(400).send('Album id must be in request!');
    }

    if (!mongoose.isValidObjectId(album)) {
        res.status(400).send('Invalid album id!');
    }

    try {
        const existAlbum = await Album.findById(album);
        if (!existAlbum) {
            res.status(404).send('Album not found!');
        }

        const newTrack = new Track({
            title,
            album,
            duration,
        });

        await newTrack.save();
        res.send(newTrack);
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            const ValidationError = Object.keys(e.errors).map(key => ({
                field: key,
                message: e.errors[key].message,
            }));
            res.status(400).send({ error: ValidationError });
        }
        next(e);
    }
});

export default tracksRouter;
