import mongoose from 'mongoose';


// esquema de ejemplo

const trialSchema = new mongoose.Schema({
    name: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Trial', trialSchema); //exporto el modelo de mongoose