import sharp from 'sharp'
import cloudinary from '../utils/cloudinary';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Comment } from '../models/comment.model';

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;
        if (!image) return res.status(401).json({
            message: "Image Required"
        })

        const optimizeImageBuffer = await sharp(image.buffer).resize({ width: 800, height: 800, fit: 'inside' }).toFormat('jpeg', { quality: 80 }).toBuffer()

        // buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizeImageBuffer.toString('base64')}`
        const cloudResponse = await cloudinary.uploader.upload(fileUri)

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            createdby: authorId,
        })

        const user = await User.findById(authorId)
        if (user) {
            user.posts.push(post._id);
            await user.save()
        }

        await post.populate({ path: 'createdby', select: -password })
        return res.status(201).json({
            message: "New Post Created",
            post,
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}



export const editPost = async (req, res) => {
    try {
        const postId = req.params.id
        const authorId = req.id
        const { caption } = req.body
        const image = req.file;

        if (!image) return res.status(401).json({
            message: "Image Required"
        })


        const post = await Post.findById(postId);

        if (image) {
            const optimizeImageBuffer = await sharp(image.buffer)
                .resize({ width: 800, height: 800, fit: 'inside' })
                .toFormat('jpeg')
                .toBuffer();

            const fileUri = `data:image/jpeg;base64,${optimizeImageBuffer.toString('base64')}`
            const cloudResponse = await cloudinary.uploader.upload(fileUri)

            post.image = cloudResponse.secure_url
        }

        if (caption) {
            post.caption = caption
        }

        await post.save()

        await post.populate({ path: 'createdby', select: -password })
        return res.status(201).json({
            message: "Post Edit Successfully",
            post,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({ path: 'createdby', select: 'username,profilepic' })
            .populate({
                path: 'comment', sort: { createdAt: -1 },
                populate: {
                    path: 'createdby', select: 'username,profilepic'
                }
            });
        if (!posts) {
            return res.status(401).json({
                message: "No Posts",
                success: false
            })
        }
        res.status(201).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ createdby: authorId }).sort({ createdAt: -1 }).populate({
            path: 'createdby', select: 'username,profilepic'
        }).populate({
            path: 'comment', sort: { createdAt: -1 },
            populate: {
                path: 'createdby',
                select: 'username,profilepic'
            }
        })

        return res.status(201).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


export const likePost = async (req, res) => {
    try {
        const userwholikedpostId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(401).json({
                message: "Post Not Found",
                success: false
            })
        }

        await post.updateOne({ $addToSet: { likes: userwholikedpostId } })
        await post.save();

        //Implement Socket io


        return res.status(201).json({
            message: "Post Liked",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const unlikePost = async (req, res) => {
    try {
        const userwhounlikedpostId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(401).json({
                message: "Post Not Found",
                success: false
            })
        }

        await post.updateOne({ $pull: { likes: userwhounlikedpostId } })
        await post.save();

        //Implement Socket io


        return res.status(201).json({
            message: "Post Unliked",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


export const addComment = async (req, res) => {
    try {
        const postid = req.params.id;
        const userwhoaddcomment = req.id;
        const { comment } = req.body
        if (!comment) {
            return res.status(401).json({
                message: "Text is required",
                success: false
            })
        }

        const post = await findById(postid)


        const cmnt = await Comment.create({
            comment,
            createdby: userwhoaddcomment,
            post: postid
        }).populate({
            path: 'createdby', select: 'username,profilepic'
        })

        await post.comment.push(cmnt._id)
        await post.save()

        return res.status(201).json({
            message: 'Comment Added',
            success: true,
            cmnt
        })


    } catch (error) {
        console.log(error)
    }
}


export const getAllCommentOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).populate('createdby', 'username,profilepic')
        if (!comments) return res.status(401).json({ message: "No Comments for that post", success: false })
        return res.status(201).json({
            success: true,
            comments
        })
    } catch (error) {
        console.log(error)
    }
}


export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(401).json({
                message: 'Post not Found',
                success: false
            })
        }


        if (post.createdby.toString() !== authorId) {
            return res.status(401).json({
                message: 'Unauthorized',
                success: false
            })
        }


        await Post.findByIdAndDelete(postId);

        let user = await User.findById(authorId)
        user.posts = user.posts.filter((id) => { id.toString() !== postId })
        await user.save()


        await Comment.deleteMany({ post: postId })

        return res.status(201).json({
            message: "Post Deleted",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(401).json({
                message: "Post Not Found",
                success: false
            })
        }

        let user = await User.findById(authorId)
        if (user.bookmarks.includes(post._id)) {
            await user.updateOne({ $pull: { bookmarks: post._id } })
            await user.save()
            return res.status(201).json({
                type: "unsaved",
                message: "Post Removed From Bookmark",
                success: true
            })
        } else {
            await user.updateOne({ $addToSet: { bookmarks: post._id } })
            await user.save()
            return res.status(201).json({
                type: "unsaved",
                message: "Post Added To Bookmark",
                success: true
            })
        }
    } catch (error) {
        console.log(error)
    }
}