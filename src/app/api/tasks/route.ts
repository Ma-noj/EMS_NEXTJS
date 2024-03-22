import { Types } from "mongoose";
import { NextResponse } from "next/server";
import connect from "../../../../lib/db";
import User from "../../../../lib/modals/user";
import Task from "../../../../lib/modals/task";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Missing Or Invalied userId" }), { status: 400 });
        }
        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 400 });
        }
        const task = await Task.find({ user: new Types.ObjectId(userId) });
        if (!task) {
            return new NextResponse(JSON.stringify({ undefined }), { status: 204 });
        }
        return new NextResponse(JSON.stringify({ message: "Found", task }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error will featching the user" }), { status: 500 });
    }
};

export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        const body = await request.json();
        const { taskTitle, taskDescription, taskPoints } = body;

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Missing Or Invalied userId" }), { status: 400 });
        }
        await connect();
        const user = await User.findById(userId);

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 400 });
        }
        const taskCreationDate = new Date();
        const taskStatus = "TODO";
        const newTask = new Task({ taskTitle, taskDescription, taskCreationDate, taskStatus, taskPoints, user: new Types.ObjectId(userId) });

        await newTask.save();
        return NextResponse.json({ message: "Created", newTask }, { status: 201 });

    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify("Error will Assging the Task to a user",), { status: 500 });
    }
};

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId, taskId } = body;
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ message: "Missing Or Invalid User ID" }, { status: 400 });
        }
        if (!taskId || !Types.ObjectId.isValid(taskId)) {
            return NextResponse.json({ message: "Missing or Invalid Task ID" }, { status: 400 });
        }
        await connect();
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }
        const task = await Task.findOne({ _id: taskId, user: userId });
        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 400 });
        }
        let updatedTask;

        const exsistingTaskStatus = task.taskStatus;
        if (exsistingTaskStatus == "TODO") {
            updatedTask = await Task.findOneAndUpdate({ _id: taskId, user: userId }, { taskStatus: "INPROGRESS" }, { new: true });
        } else if (exsistingTaskStatus == "INPROGRESS") {
            updatedTask = await Task.findOneAndUpdate({ _id: taskId, user: userId }, { taskStatus: "DONE" }, { new: true });
        } else if (exsistingTaskStatus == "DONE") {
            return NextResponse.json({ message: "Task already Completed" }, { status: 400 });
        }
        if (!updatedTask) {
            return NextResponse.json({ message: "Task Not Updated" }, { status: 400 });
        }
        return NextResponse.json({ message: "Task Updated", updatedTask }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error will Updateing the Task" }, { status: 500 });
    }

};