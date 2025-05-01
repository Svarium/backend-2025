// models/task.model.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    dueDate: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    files: [{
        name: String,
        path: String,
        size: Number,
        mimetype: String
    }]
},
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('Task', taskSchema);