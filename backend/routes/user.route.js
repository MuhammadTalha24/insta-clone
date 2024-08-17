import express from 'express'
import { editProfile, followOrunfollow, getProfile, getSuggestedUser, login, logout, register } from '../controllers/userControllers.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/profile/:id').get(isAuthenticated, getProfile)
router.route('/suggested').get(isAuthenticated, getSuggestedUser)
router.route('/followorunfollow/:id').post(isAuthenticated, followOrunfollow)
router.route('/profile/edit').post(isAuthenticated, upload.single('profilepic'), editProfile)


export default router