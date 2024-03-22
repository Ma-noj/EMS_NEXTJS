import mongoose from "mongoose";

//Getting MongoDB URI from Environment Variables
const MONGODB_URI = process.env.MONGODB_URI;
const connect = async () => {
    const connectionStates = mongoose.connection.readyState;

    //Checking Connection State
    if (connectionStates === 1) {
        return;
    } if (connectionStates == 2) {
        return;
    }

    //Establishing Connection to MongoDB
    try {
        mongoose.connect(MONGODB_URI!, { dbName: "ems", bufferCommands: false });
        console.log("Connection established");
        return;
       
    } catch (error) {
        console.log(error);
        throw new Error("Error in connecting to MongoDB");
    }
};

export default connect;