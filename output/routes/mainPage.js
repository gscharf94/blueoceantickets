import * as express from 'express';
export const router = express.Router();
router.get('/', (req, res) => {
    res.render('mainPage', { title: "hello world" });
});