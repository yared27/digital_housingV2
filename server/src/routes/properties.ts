import { Router } from "express";
import { requireRole } from "../middlewares/roles";
import {requireAuth} from "../middlewares/auth";
import { createProperty, deleteProperty, listProperties, getProperty, updateProperty } from "../controllers/properties.controller";

const router = Router();

router.post('/', requireAuth, requireRole(['owner', 'admin']), createProperty);
router.get('/', listProperties);
router.get('/:id', getProperty);
router.put('/:id', requireAuth, requireRole(['owner', 'admin']), updateProperty);
router.delete('/:id', requireAuth, requireRole(['owner', 'admin']), deleteProperty);

export default router;
