// stores/useBookingStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useBookingStore = create(
    persist(
        (set, get) => ({
            bookingDetails: [],

            // Replace the entire booking list
            setBookingDetails: (bookingsArray) => {
                set({ bookingDetails: bookingsArray });
            },

            // Add a single new booking
            addBooking: (newBooking) => {
                const currentDetails = get().bookingDetails;
                set({
                    bookingDetails: [...currentDetails, newBooking],
                });
            },

            removeBooking: (id) => {
                const currentDetails = get().bookingDetails;
                set({
                    bookingDetails: currentDetails.filter(
                        (booking) => booking.id !== id
                    ),
                });
            },

            clearBookingDetails: () => set({ bookingDetails: [] }),

            getBookingById: (id) => {
                const currentDetails = get().bookingDetails;
                return currentDetails.find((booking) => booking.id === id) || null;
            },
        }),
        {
            name: 'booking-storage',
            storage: createJSONStorage(() => localStorage),
            migrate: (persistedState, version) => {
                if (!persistedState || !Array.isArray(persistedState.bookingDetails)) {
                    return { bookingDetails: [] };
                }
                return persistedState;
            },
        }
    )
);

export default useBookingStore;
