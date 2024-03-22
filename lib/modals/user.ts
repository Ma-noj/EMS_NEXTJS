import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    userName: { type: "string", required: true },
    userEmail: { type: "string", required: true, unique: true },
    userPassword: { type: "string", required: true },
    userPhoneNumner: { type: "number", required: true },
    userAge: { type: "number", required: true },
    userRole: { type: "string", required: true },
    userStatus: { type: "string", enum: ["ACTIVE", "INACTIVE"], required: true, default: "ACTIVE" }
});

const User = models.User || model("User", UserSchema);

export default User;