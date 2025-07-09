export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
export const verifyOTP = (input, actual) => {
    return input === actual;
};
export const isOtpExpired = (expiresAt) => {
    return new Date() > new Date(expiresAt);
};
