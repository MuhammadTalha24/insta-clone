import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { recieveMessage, sendMessage } from '../controllers/chatController.js';


const router = express.Router();

router.route('/send/:id').post(isAuthenticated, sendMessage);
router.route('/all/:id').post(isAuthenticated, recieveMessage);


export default router