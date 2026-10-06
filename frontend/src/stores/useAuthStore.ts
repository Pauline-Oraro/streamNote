import { axiosInstance} from "@/lib/axios";
import {create} from "zustand";

interface AuthStore{
    isAdmin : boolean;
    isLoading: boolean;
    error: string | null;

    checkAdminStatus: () => Promise<void>;
    reset: () => void;
}

// This store manages the state related to authentication, specifically checking if the user has admin privileges. It provides methods to check the admin status and reset the store's state. The store keeps track of loading states and error messages during the authentication process.

export const useAuthStore = create<AuthStore>((set) => ({
	isAdmin: false,
	isLoading: false,
	error: null,

	checkAdminStatus: async () => {
		set({ isLoading: true, error: null });

		try {
			const response = await axiosInstance.get("/admin/check");
			set({ isAdmin: response.data.admin });

		} catch (error: any) {
			set({ isAdmin: false, error: error.response.data.message });

		} finally {
			set({ isLoading: false });
		}
	},

	reset: () => {
		set({ isAdmin: false, isLoading: false, error: null });
	},
}));