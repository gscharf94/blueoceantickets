import * as express from 'express';
import { pool } from '../db.js';

export const router = express.Router();

router.get('/:job_name', (req, res) => {
  console.log(`job name: ${req.params.job_name}`);
  res.render('viewJob', { test: 'goodbye world' });
});