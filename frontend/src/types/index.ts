// This file contains TypeScript interfaces for various entities used in the application. Interfaces in TypeScript are used to define the structure of an object, specifying the properties and their types. They help ensure that objects adhere to a specific shape, providing type safety and better code organization.

export interface Song{
    _id: string;
    title: string;
    artist: string;
    albumId: string | null;
    imageUrl : string;
    audioUrl: string;
    duration: number;
    createdAt: string;
    updatedAt : string;
}

export interface Album {
	_id: string;
	title: string;
	artist: string;
	imageUrl: string;
	releaseYear: number;
	songs: Song[];
}

export interface Stats {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
}

export interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	_id: string;
	clerkId: string;
	fullName: string;
	imageUrl: string;
}