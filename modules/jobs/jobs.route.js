import express from 'express';
import { createJob, deleteJob, getJobs, updateJob, uploadJobDocument } from './jobs.controller.js';
import {docUpload}  from '../../middleware/multer.js';

const jobRouter = express.Router();

jobRouter.post('/', createJob);
jobRouter.get('/', getJobs);
jobRouter.put('/:id', updateJob);
jobRouter.patch('/:id', deleteJob); // patch bcs soft delete
jobRouter.post('/:id/documents/:portalId', docUpload.single('document'), uploadJobDocument);

export default jobRouter;