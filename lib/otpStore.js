// Global OTP store that persists across API calls
global.otpStore = global.otpStore || new Map();

// OTP Store API
const otpStoreAPI = {
    // Set OTP
    set(phone, otpData) {
        global.otpStore.set(phone, otpData);
    },

    // Get OTP
    get(phone) {
        const otpData = global.otpStore.get(phone);
        if (otpData) {
            // Check if OTP is expired (10 minutes)
            const now = Date.now();
            if (now - otpData.timestamp > 10 * 60 * 1000) {
                this.delete(phone);
                return null;
            }
            return otpData;
        }
        return null;
    },

    // Delete OTP
    delete(phone) {
        return global.otpStore.delete(phone);
    },

    // Get size
    get size() {
        return global.otpStore.size;
    },

    // Get all entries
    entries() {
        return global.otpStore.entries();
    },

    // Get all keys
    keys() {
        return global.otpStore.keys();
    },

    // Check if key exists
    has(phone) {
        return global.otpStore.has(phone);
    },

    // Clear all OTPs
    clear() {
        global.otpStore.clear();
    },

    // Get all OTPs for debugging
    getAllOtps() {
        const now = Date.now();
        const validOtps = {};

        for (const [phone, otpData] of global.otpStore.entries()) {
            if (now - otpData.timestamp < 10 * 60 * 1000) {
                validOtps[phone] = {
                    ...otpData,
                    ageInMinutes: Math.floor((now - otpData.timestamp) / (1000 * 60))
                };
            }
        }

        return validOtps;
    }
};

export default otpStoreAPI;
