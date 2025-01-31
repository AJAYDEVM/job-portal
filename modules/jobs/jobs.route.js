import express from 'express';
import { createJob, deleteJob, getJobs, updateJob } from './jobs.controller.js';

const jobRouter = express.Router();

jobRouter.post('/', createJob);
jobRouter.get('/', getJobs);
jobRouter.put('/:id', updateJob);
jobRouter.patch('/:id', deleteJob); // patch bcs soft delete

export default jobRouter;