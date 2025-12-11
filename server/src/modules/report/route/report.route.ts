import express from 'express';

import { AuthGuard, isAuthorize } from '../../../middlewares/auth.middleware';
import { RoleEnum } from '../../auth/enums';
import { getDashboardStats } from '../controller/report.controller';

const router = express.Router();

router.route('/dashboard').get(AuthGuard, isAuthorize(RoleEnum.Admin), getDashboardStats);

export default router;
