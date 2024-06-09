const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required!'],
        minLength: 5,
    },
    type: {
        type: String,
        required: [true, 'Type is required!'],
        minLength: 3,
    },
    certificate: {
        type: String,
        required: [true, 'Certificate is required!'],
        minLength: 2,
    },
    image: {
        type: String,
        required: [true, 'Image is required!'],
        match: /^https?:\/\//,
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minLength: 10,
    },
    price: {
        type: Number,
        required: [true, 'Price is required!'],
        min: 0,
    },
    singUpList: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
}, 
{ timestamps: true}
);
// if NO timestamps
  // createdAt: {
    //     type: Date
    // }
// courseSchema.pre('save', function() {
//     if (!this.createdAt) {
//         this.createdAt = Date.now();
//     }
// });
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
