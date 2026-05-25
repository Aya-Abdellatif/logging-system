export const errorHandler = (error, request, response, next) => {
    
    console.error(error);

    // mongoose Errors
    if (error.code === 11000 || error.name === "ValidationError" || error.name === "CastError") {
        return response.status(400).json({ message: "Invalid Data" })
    }

    // default
    return response.status(500).json({ message: "Internal server error" })
};