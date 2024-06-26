const Course = require('../models/Course');
const User = require('../models/User');

exports.create = async (userId, courseData) => {
    const createdCourse = await Course.create({
        owner: userId,
        ...courseData,
    });

    await User.findByIdAndUpdate(userId, { $push: { createdCourses: createdCourse._id } });
    
    return createdCourse;
}

exports.getAll = () => Course.find();

exports.getOne = (courseId) => Course.findById(courseId);

exports.getOneDetailed = (courseId) => this.getOne(courseId).populate('owner').populate('singUpList');

exports.getLatest = () => {

    const latestCourses = Course.find().sort({createdAt: -1}).limit(3);

    // const latestCourses = Course.find().slice(-3);

    return latestCourses;
}

exports.singUp = async (courseId, userId) => {
    //With 2 queries
    // await Course.findByIdAndUpdate(courseId, { $push: { singUpList: userId } });
    // await User.findByIdAndUpdate(userId, { $push: { singedUpCourses: courseId } });

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    course.singUpList.push(userId);
    user.singedUpCourses.push(courseId);

    await course.save();
    await user.save();
};

exports.delete = (courseId) => Course.findByIdAndDelete(courseId);

exports.edit = (courseId, courseData) => Course.findByIdAndUpdate(courseId, courseData,{ runValidators: true});