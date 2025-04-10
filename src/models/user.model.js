import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    password:{
        type: String,
        required: true
    }
}, 
    {
        timestamps: true,
        versionKey: false  // To remove versionKey from the output document
    }
)

export default mongoose.model('User', userSchema);