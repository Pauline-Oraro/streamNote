import { User } from "../models/user.model.js";

// check if users is signing up or is logging in
export const authCallback = async (req, res, next) => {
    try {
        // get the id, firstname, lastname, imageurl
        const { id, firstName, lastName, imageUrl } = req.body;

        // check if user exists
        const user = await User.findOne({ clerkId: id});

        // if user doesn't exist , signup the user
        if (!user) {
        await User.create({
            clerkId: id,
		    fullName: `${firstName || ""} ${lastName || ""}`.trim(),
			imageUrl,
        });
    }

        // if user exists
        res.status(200).json({ success: true });

    } catch(error){
        console.log("Error in auth callback", error);
		next(error);
    }
}