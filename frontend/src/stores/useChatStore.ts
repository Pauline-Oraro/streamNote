import { axiosInstance } from "@/lib/axios";
import type { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
    users: User[];
	isLoading: boolean;
	error: string | null;
	socket: any;
	isConnected: boolean;
	onlineUsers: Set<string>;
	userActivities: Map<string, string>;
	messages: Message[];
	selectedUser: User | null;
	fetchUsers: () => Promise<void>;
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, senderId: string, content: string) => void;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
}

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const socket = io(baseURL, {
    autoConnect: false,
    withCredentials: true,
});

// This store manages the state related to chat functionality, including users, messages, and socket connections. It provides methods to fetch users, initialize and disconnect the socket connection, send messages, and fetch messages for a specific user. The store also keeps track of online users and their activities.

export const useChatStore = create<ChatStore>((set, get) => ({
    users: [],
	isLoading: false,
	error: null,
	socket: socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: [],
	selectedUser: null,

    setSelectedUser: (user) => set({selectedUser: user}),

    // Fetches the list of users from the server and updates the store with the retrieved data. If an error occurs during the fetch, it sets the error state accordingly.
    fetchUsers: async () => {
        set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/users");
			set({ users: response.data });

		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
    },

    // Initializes the socket connection for real-time communication. It sets up event listeners for various socket events, such as user connections, disconnections, message reception, and activity updates. The method also updates the store's state based on these events.
    initSocket: (userId) => {
        if (!get().isConnected){
            socket.auth = {userId};

            socket.connect();

            socket.emit("user_connected", userId);

            socket.on("users_online", (users: string[]) => {
                set({ onlineUsers: new Set(users) });
            });

            socket.on("activities", (activities: [string, string][]) => {
				set({ userActivities: new Map(activities) });
			});

            socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

            socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					return { onlineUsers: newOnlineUsers };
				});
			});

            socket.on("receive_message", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

            socket.on("message_sent", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

            socket.on("activity_updated", ({ userId, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

            set({ isConnected: true });

        }
    },

    // Disconnects the socket connection if it is currently connected. It updates the store's state to reflect that the socket is no longer connected.
    disconnectSocket: () => {
        if (get().isConnected) {
			socket.disconnect();
			set({ isConnected: false });
		}
    },

    // Sends a message to a specified receiver through the socket connection. It emits a "send_message" event with the receiver's ID, sender's ID, and the message content. If the socket is not connected, the method simply returns without performing any action.
    sendMessage: async (receiverId, senderId, content) => {
        const socket = get().socket;

        if (!socket){
            return;
        }
        socket.emit("send_message", { receiverId, senderId, content });
    },

    // Fetches the list of messages for a specific user from the server and updates the store with the retrieved data. If an error occurs during the fetch, it sets the error state accordingly.
    fetchMessages: async (userId: string) => {
        set({isLoading: true, error: null});
        try{
            const response = await axiosInstance.get(`/users/messages/${userId}`);
			set({ messages: response.data }); 

        } catch (error:any){
            set({ error: error.response.data.message });
        } finally{
            set({ isLoading: false });
        }
    },
}));