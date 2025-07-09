export const errorHandler = (err, _req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    console.error(err);
    res.status(status).json({ message });
};
