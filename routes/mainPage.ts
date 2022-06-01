import * as express from 'express';
import { pool } from "../db.js";

export const router = express.Router();
router.get('/', (req, res) => {
  (async () => {
    let query = await pool.query('SELECT * FROM jobs');
    let jobs = query.rows;
    res.render('mainPage', { jobs: jobs });
  })();
});