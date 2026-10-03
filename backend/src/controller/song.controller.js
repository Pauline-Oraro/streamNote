import { Song } from "../models/song.model.js";

// get all songs
export const getAllSongs = async (req, res, next) => {
    try {
        const songs = await Song.find().sort({createdAt: -1});
        res.json(songs);
    } catch (error){
        next(error);
    }
}

// get featured songs
export const getFeaturedSongs = async (req, res, next) => {
    try{
        const songs = await Song.aggregate([
        {$sample:{size:6}},
        {$project:{
            _id: 1,
			title: 1,
			artist: 1,
			imageUrl: 1,
			audioUrl: 1,
        }}
    ]);
    res.json(songs);
    } catch (error){
        next(error);
    }
}

// get made for you songs
export const getMadeForYouSongs = async (req, res, next) => {
    try{
        const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);
        res.json(songs);
    } catch (error){
        next(error);
    }
}

// get trending songs
export const getTrendingSongs = async (req, res, next) => {
    try{
        const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);
        res.json(songs);
    } catch (error){
        next(error);
    }
}