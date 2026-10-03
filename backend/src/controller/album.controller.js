import { Album } from "../models/album.model.js";

// get all albums
export const getAllAlbums = async (req, res, next) => {
    try {
        const albums = await Album.find();
        res.status(200).json(albums);
    } catch (error){
        next(error)
    }
}

// get album by id
export const getAlbumById = async (req, res, next) => {
    try {
        const {albumId} = req.params;

        const album = await Album.findById(albumId).populate("songs");

        // if album is not found
        if(!album){
            return res.status(404).json({message: "Album not found"})
        }

        // if album is found
        res.status(200).json(album);
    } catch (error){
        next(error);
    }
}
