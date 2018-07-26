const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var commentSchema = new Schema({
    //MongoDB stores an ID for the comment on their own system, no need for one here.
    "projectID": String,
    "authorName": String,
    "commentText": String,
    "postedDate": Date,
    "replies": [{
        "comment_id": String,
        "authorName": String,
        "authorEmail": String,
        "commentText": String,
        "repliedDate": Date
    }]
});

let Comment;
let db;
let projectID;

module.exports.initialize = function (projectid) {
    return new Promise(function (resolve, reject) {
        db = mongoose.createConnection("mongodb://sward15:L3r9k120hp@ds155644.mlab.com:55644/studentworks", { useNewUrlParser : true });
        db.on('error', (err) => {
            console.log("errors");
            reject(err)
        });
        db.once('open', () => {
            console.log("connected to mongoDB");
            Comment = db.model('comments', commentSchema);
            projectID = projectid;
            resolve();
        });
    });
};


module.exports.getAllComments = function () {
    return new Promise(function (resolve, reject) {
        Comment.find({ projectID: projectID})
               .sort({ 'postedDate': -1 })
               .exec()
               .then((comment) => {
                //console.log("in comments");
                if (!comment) { //error checking purposes
                    console.log("No comments found")
                } else {
                    //console.log("found comments");
                    resolve(comment);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports.addComment = function (data) {
    return new Promise(function (resolve, reject) {
        
        data.postedDate = Date.now();
        let newComment = new Comment(data);
        newComment.save((err) => {
            if (err) {
                reject("There was an error saving the comment:" + err);
            }
            else {
                resolve(newComment._id);
            }
            //process.exit();
        });
    });
};

module.exports.addReply = function (data) {
    return new Promise(function (resolve, reject) {
        data.repliedDate = Date.now();
        console.log(data);
        Comment.update({ _id: data.comment_id }, { $addToSet: { replies: data } })
            .exec()
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}