import { NextResponse } from "next/server";
import connect from "../../../../lib/db"
import User from "../../../../lib/modals/user";
import { request } from "http";
import { Types } from "mongoose";

export const GET = async () => {
    try {
        await connect();
        //featching all the users from the database
        const listOfUsers = await User.find();
        //verifying the list of users is empty
        if (!listOfUsers || listOfUsers.length === 0) {
            return new NextResponse(JSON.stringify(undefined), { status: 204 });
        }
        return new NextResponse(JSON.stringify({ message: "Found", listOfUsers }), { status: 200 });
    } catch (error) {

        return new NextResponse(JSON.stringify({ error: error }), { status: 500 });
    }
}
// saving user into database
export const POST = async (request: Request) => {
    try {
        await connect();
        const body = await request.json();
        const user = new User(body);
        const saveUser = await user.save();
        if (!saveUser) {
            return new NextResponse(JSON.stringify({ message: "User Not Saved" }), { status: 400 });
        }
        return new NextResponse(JSON.stringify({ message: "Saved", data: saveUser }), { status: 201 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error }), { status: 500 });

    }
};
// Changing the User Password
export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userEmail, userPassword } = body;
        await connect();
        //verifying that the userEmail and userPassword are not empty
        if (!userEmail || !userPassword) {
            return new NextResponse(JSON.stringify({ message: "Missing userEmail Or Password" }), {
                status: 400
            });
        }
        await connect();
        //verifying that the user exsist with the given email
        const user = await User.findOne({ userEmail: userEmail });
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User Not Found" }), { status: 404 });
        }
        //Updateing the given new UserPassword based on the userId
        const updatedUser = await User.findByIdAndUpdate(user.id, { userPassword: userPassword });
        //verifying the password updeted or not
        if (!updatedUser) {
            return new NextResponse(JSON.stringify({ message: "User Not Updated" }), {
                status: 400
            });
        }
        return new NextResponse(JSON.stringify({ message: "Updated", data: updatedUser }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error while Updating User Password", error }), { status: 500 });
    }
};

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = await searchParams.get('userId');
        //verify userId is valid and not empty
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Missing or Invalid userId" }), { status: 400 });
        }
        await connect();
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 400 });
        }
        return new NextResponse(JSON.stringify(undefined), { status: 204 });

    } catch (error) {
        return NextResponse.json({ messsage: "Error will deleteing the User" }, { status: 500 });
    }
};