import path from 'path';
import express from 'express';
import { router as mainPage } from './routes/mainPage.js';
const app = express();
const PORT = 3000;
app.set('view engine', 'pug');
app.set('views', path.join(path.dirname(''), 'views'));
app.locals.basedir = "/";
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true,
}));
app.use('/', mainPage);
app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
});
