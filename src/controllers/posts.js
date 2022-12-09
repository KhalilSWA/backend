const Post = require("../models/posts");
const User = require("../models/users");
const ObjectId = require("mongoose").Types.ObjectId;
const { v4: uuidv4 } = require('uuid');
const { uploadFile, deleteImageFromFirebase } = require('../config/firebase');

async function createPost(req, res) {
    try {
        const { title, content, price, pictures } = req.body;
        const post = new Post({
            user_id: ObjectId(req.user.id),
            content: content,
            price: price,
            title: title
        });

        await post.save()
        res.status(200).json(post);
    } catch(error) {
        res.status(400).json(error.message);
    }
}

async function getPost(req, res) {
    try {
        const { post_id } = req.params;
        let post = await Post.findOne({_id: ObjectId(post_id)}).populate({path: 'user_id', select: 'userName phone', model: User});

        if (!post)
            throw new Error('Post not found');

        post = post.toObject();
        const likes = post.likes.length;
        let is_liked = false;

        if (likes > 0) {
            post.likes = new Set(post.likes.map(item => item.toString()));
            is_liked = post.likes.has(req.user.id);
        }

        post.likes = likes;
        post.is_liked = is_liked;

        res.status(200).json(post);
    } catch(error) {
        console.log(error);
        res.status(404).json(error.message);
    }
}

async function updatePost(req, res) {
    try {
        const { post_id } = req.params;
        const updateObj = await Post.updateOne({_id: ObjectId(post_id), user_id: ObjectId(req.user.id)}, req.body);

        if (updateObj.modifiedCount != 1)
            throw new Error('Post could not be updated');

        res.status(200).json("Post has been updated successfully");
    } catch(error) {
        res.status(404).json(error.message);
    }
}

async function uploadPictures(req, res) {
    try {
        const { post_id } = req.params;
        if (!req.files) {
            throw new Error('Pictures not found');
        }

        const pictures = (await Post.findById(ObjectId(post_id), {pictures: 1})).pictures;
        const promises = [];
        
        for (const picture of pictures) {
            promises.push(deleteImageFromFirebase(picture.split('?')[0].slice(-36)));
        }

        for (let file of req.files) {
            const filename = 'Posts/'+uuidv4();
            promises.push(uploadFile(file.path, filename));
        }

        let links = (await Promise.all(promises)).slice(-req.files.length);
        await Post.updateOne({_id: ObjectId(post_id)}, {$set: {pictures: links}});
        res.status(200).send(links);
    } catch(error) {
        res.status(404).json(error.message);
    }
}

async function deletePost(req, res) {
    try {
        const { post_id } = req.params;
        const deletedObj = await Post.deleteOne({_id: ObjectId(post_id), user_id: ObjectId(req.user.id)});

        if (deletedObj.deletedCount != 1)
            throw new Error('Post could not be deleted');

        res.status(200).json("Post has been deleted");
    } catch(error) {
        res.status(404).json(error.message);
    }
}

async function loadPosts(req, res) {
    try {
        const { page, limit } = req.query;   
        const posts = await Post.find({}, {title: 1, picture: 1}).sort({createdAt: -1}).skip(page * limit).limit(limit);
        res.status(200).json(posts);
    } catch(error) {
        console.log(error)
        res.status(404).json(error.message);
    }
}

module.exports = {
    createPost,
    updatePost,
    uploadPictures,
    deletePost,
    loadPosts,
    getPost
}