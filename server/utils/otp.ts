export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const verifyOTP = (input: string, actual: string): boolean => {
  return input === actual;
};

export const isOtpExpired = (expiresAt: string): boolean => {
  return new Date() > new Date(expiresAt);
};