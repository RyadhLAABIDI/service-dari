import express from 'express';
import { getAudit, getLastAudit } from '../controllers/AuditController.js';

const router = express.Router();

router.get('/audit', getAudit);
router.get('/audit/last', getLastAudit);

export default router;