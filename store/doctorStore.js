import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialState = {
    _id: "",
    name: "",
    image: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    experience: 0,
    price: 0,
    specialization: "",
    status: "pending",
    availability: [],
    services: [],
    about: "",
    degree: "",
    hospital: "",
    slots: {},
    // New fields from updated doctor model
    virtualConsultation: false,
    inPersonConsultation: false,
    hasWebsite: false,
    websiteUrl: null,
    createdAt: "",
    updatedAt: "",
};

export const useDoctorStore = create(
    persist(
        (set, get) => ({
            ...initialState,

            // Set basic info from registration
            setBasicInfo: (data) => set((state) => ({ ...state, ...data })),

            // Set profile info from update
            setProfileInfo: (data) => set((state) => ({ ...state, ...data, status: "approved" })),

            // Set complete doctor data (e.g., after fetching from DB)
            setDoctorData: (data) => {
                set((state) => ({ ...state, ...data }));
            },

            // Clear store
            clearDoctorData: () => {
                if (typeof window !== "undefined") {
                    // Clear localStorage directly to ensure complete cleanup
                    localStorage.removeItem("doctor-storage");
                }
                set(initialState);
            },
        }),
        {
            name: "doctor-storage",
            storage: createJSONStorage(() => {
                if (typeof window !== "undefined") {
                    return localStorage;
                }
                return {
                    getItem: () => Promise.resolve(null),
                    setItem: () => Promise.resolve(),
                    removeItem: () => Promise.resolve(),
                };
            }),
        }
    )
);