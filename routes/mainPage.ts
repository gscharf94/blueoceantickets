import * as express from 'express';
import { pool } from "../db.js";

export const router = express.Router();
router.get('/', (req, res) => {
  res.render('mainPage', { title: "hello world" });
});