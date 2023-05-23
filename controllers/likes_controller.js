const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.toggleLike = async function(req, res){
    try{
        let likeable;
        let deleted = false;
        if(req.query.type === 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }
        else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }
        console.log(likeable);
        //check if like is already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        //if like is already exists rhen delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;
            console.log(deleted);
        }
        else{
            //if like is not exists create a new one
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }


        return res.json(200, {
            message: 'Request Successful',
            data: {
                deleted: deleted
            }
        })

    }catch(err){
        console.log(err);
        res.status(500, {
            message: 'Internal server error'
        });
    }
}