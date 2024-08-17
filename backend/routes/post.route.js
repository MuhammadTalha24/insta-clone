import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from '../middlewares/multer.js'
import { addComment, addNewPost, bookmarkPost, deletePost, editPost, getAllCommentOfPost, getAllPosts, likePost, unlikePost } from '../controllers/postController.js'
const router = express.Router()


router.route('/addpost').post(isAuthenticated, upload.single('image'), addNewPost)
router.route('/editpost').post(isAuthenticated, upload.single('image'), editPost)
router.route('/userpost/all').get(isAuthenticated, getAllPosts)
router.route('/like/:id').post(isAuthenticated, likePost)
router.route('/unlike/:id').post(isAuthenticated, unlikePost)
router.route('/comment/:id').post(isAuthenticated, addComment)
router.route('/comment/all/:id').post(isAuthenticated, getAllCommentOfPost)
router.route('/delete/:id').post(isAuthenticated, deletePost)
router.route('/bookmark/:id').post(isAuthenticated, bookmarkPost)






export default router