import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    pattern: {
        type: [String],
        required: true
    },
    categories: {
        type: [String],
        required: true
    },
    sets: [{
        category: {
            type: String,
            required: true
        },
        images: [{
            id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }]
    }],
    sequence: {
        type: Boolean,
        default: false
    }
});

const usertModel = mongoose.model('User', UserSchema);
export { usertModel };