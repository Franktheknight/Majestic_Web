const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require('./comment');

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: String,
    topic: {
        type: String,
        enum: ['philosophy', 'engineering', 'Frank opinions']
    },
    essay: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

postSchema.post("findOneAndDelete", async function(doc) {
    if(doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model("Post", postSchema);
