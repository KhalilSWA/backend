const Post = require("../models/posts");
const ObjectId = require("mongoose").Types.ObjectId;

async function likePost(req, res) {
    try {
        const { post_id } = req.params;

        let isLiked = await Post.updateOne({post_id: ObjectId(post_id), likes: {$nin: [ObjectId(req.user.id)]}}, {$addToSet: {likes: ObjectId(req.user.id)}});
        if (isLiked.modifiedCount == 1) {
            res.status(200).json("Post liked");
        } else {
            isLiked = await Post.updateOne({post_id: ObjectId(post_id)}, {$pull: {likes: ObjectId(req.user.id)}});
            if (isLiked.matchedCount == 0)
                throw new Error('Post not found');
            res.status(200).json("Like removed");
        }        
    } catch(error) {
        res.status(401).json(error.message);
    }
}

module.exports = {
    likePost
}