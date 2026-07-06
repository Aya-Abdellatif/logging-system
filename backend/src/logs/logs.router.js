import express from "express";
import { getLogs, postLog, postLogsBatch, getLogStats } from './log.controllers.js';
import {validateAuthToken, attachDeveloperIfPresent} from '../middlewares/auth.middleware.js';


const router = express.Router({ mergeParams: true });

router.get('/', validateAuthToken, getLogs);
router.get('/stats', validateAuthToken, getLogStats);
router.post('/', attachDeveloperIfPresent, postLog);
router.post('/batch', attachDeveloperIfPresent, postLogsBatch);

export default router;