import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    image: {
        type: String,
        default: null,
    },
    info: String,
});

const Artist = mongoose.model("Artist", ArtistSchema);
export default Artist;