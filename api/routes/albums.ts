import express from "express";
import mongoose from "mongoose";
import Artist from "../models/Artist";
import Album from "../models/Album";

const albumsRouter = express.Router();

albumsRouter.get("/", async (req, res, next) => {
    const artistIdQuery = req.query.artist_id;

    try {
        const filter = artistIdQuery ? {artist: artistIdQuery} : {};
        const album = await Album.find(filter);
        res.send(album);
    } catch (e) {
        next(e);
    }
});

albumsRouter.post("/", async (req, res, next) => {
    const { title, artist, yearOfIssue, image } = req.body;

    if (!artist) {
        res.status(400).send('Artist id must be in request!');
    }

    if (!mongoose.isValidObjectId(artist)) {
        res.status(404).send('Artist id not found!');
    }

    try {
        const existArtist = await Artist.findById(artist);
        if (!existArtist) {
            res.status(404).send('Artist not found!');
        }

        const newAlbum = new Album({
            title,
            artist,
            yearOfIssue,
            image,
        });

        await newAlbum.save();
        res.send(newAlbum);
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


export default albumsRouter;