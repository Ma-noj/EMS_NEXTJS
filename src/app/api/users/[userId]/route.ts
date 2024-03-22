import { Types } from "mongoose";
import { NextResponse } from "next/server";
import connect from "../../../../../lib/db";
import User from "../../../../../lib/modals/user";
import Task from "../../../../../lib/modals/task";


//feating user data based on the userId
export const GET = async (request: Request, context: { params: any }) => {
    try {
        const userId = context.params.userId;
        //verify userId is valid and not empty
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or Missing UserId" }), { status: 400 });
        }
        await connect();
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 400 });
        }
        if (user.userStatus == "INACTIVE") {
            return new NextResponse(JSON.stringify(undefined), { status: 204 });
        }
        return new NextResponse(JSON.stringify({ message: "Found", user }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ message: "Error will featching the User By UserId" }), { status: 500 });
    }
};

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { userEmail, userPassword } = body;
        if (!userEmail) {
            return NextResponse.json({ message: "Please enter the user email" }, { status: 400 });
        }
        if (!userPassword) {
            return NextResponse.json({ message: "Please enter the user password" }, { status: 400 });
        }
        await connect();
        const user = await User.findOne({ userEmail: userEmail });
        if (!user) {
            return NextResponse.json({ message: "User With The given Email Not Found" }, { status: 404 });
        }
        if (user.userPassword !== userPassword) {
            return NextResponse.json({ message: "Incorrect password" }, { status: 400 });
        }

        if (user.userStatus == "INACTIVE") {
            return NextResponse.json({ message: "User With The given Email Not Active" }, { status: 404 });
        }
        return NextResponse.json({ message: "User Logined in", user }, { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error will Login" }), { status: 500 });
    }
};
