import { Router } from "express";
import { requireRole } from "../middlewares/roles";
import {requireAuth} from "../middlewares/auth";
import {
	appendPropertyImages,
	createProperty,
	deleteProperty,
	listProperties,
	getProperty,
	updateProperty,
} from "../controllers/properties.controller";
import { checkAvailabilityForProperty } from "../controllers/bookings.controller";

const router = Router();

router.post('/', requireAuth, requireRole(['owner', 'admin']), createProperty);
router.get('/', listProperties);
router.get('/:id/availability', checkAvailabilityForProperty);
router.get('/:id', getProperty);
router.put('/:id', requireAuth, updateProperty);
router.post('/:id/images', requireAuth, appendPropertyImages);
router.delete('/:id', requireAuth, deleteProperty);

export default router;
