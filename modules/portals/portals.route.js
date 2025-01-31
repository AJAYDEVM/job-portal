import express from 'express';
import { createPortals, deletePortal, getPortals, updatePortal } from './portals.controller.js';
import upload from '../../middleware/multer.js';

const portalRouter = express.Router();

portalRouter.post('/', upload.single('logo'),  createPortals);
portalRouter.get('/', getPortals);
portalRouter.patch('/:id', deletePortal);
portalRouter.put('/:id', upload.single('logo'), updatePortal);

export default portalRouter;