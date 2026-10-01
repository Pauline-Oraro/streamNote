// create song
export const createSong = async (req, res) => {}

// delete a song
export const deleteSong = async (req, res, next) => {}

// create album
export const createAlbum = async (req, res, next) => {}

// delete album
export const deleteAlbum = async (req, res, next) => {}

// check if the user is an admin
export const checkAdmin = async (req, res, next) => {
	res.status(200).json({ admin: true });
};