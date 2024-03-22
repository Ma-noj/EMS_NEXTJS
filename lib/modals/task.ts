import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema({
    taskTitle: { type: "string", required: true },
    taskDescription: { type: "string", required: true },
    taskCreationDate: { type: "date" },
    taskCompletedDate: { type: "date" },
    taskStatus: { type: "string", enum: ["TODO", "INPROGRESS", "DONE"], required: true },
    taskPoints: { type: "number", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

const Task = models.Task || model("Task", TaskSchema);

export default Task;