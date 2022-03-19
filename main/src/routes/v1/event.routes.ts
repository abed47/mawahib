import { Router } from "express";
import * as controller from '../../controllers/v1/event.controller';
import {verifyJwtToken} from "../../middlewares/authmiddleware";

const router = Router();

router.post('/home', controller.home);
router.post('/subscribe', verifyJwtToken, controller.subscribe);
router.post('/unsubscribe', verifyJwtToken, controller.unsubscribe);
router.post('/view/:id', controller.view);
router.post('/participate', verifyJwtToken, controller.participate);
router.post('/withdraw', verifyJwtToken, controller.withdraw);
router.post('/vote', verifyJwtToken, controller.createVote);

//TODO: add admin middleware
router.get('/:id', controller.getOne);
router.post('/admin-display', controller.eventAdminView);
router.post('/activate-voting', controller.activateVotes);
router.post('/deactivate-voting', controller.deactivateVotes);
router.post('/stage', controller.createStage);
router.post('/stage-publish', controller.publishStage);
router.post('/stage-unpublish', controller.unpublishStage);
router.post('/move-to-next-stage', controller.moveToNextStage);
router.post('/move-to-next-stage-summary', controller.moveToNextStageSummary);

export default router;