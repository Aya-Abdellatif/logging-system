export const errorHandler = ((error, request, response, next) => {
    console.error(error);

    if (error.code === 11000 || error.name === "ValidationError" || error.name === "CastError") {
        return response.status(400).json({ message: "Invalid User Data." })
    }

    return response.status(500).json({ message: "Something went wrong." })
});