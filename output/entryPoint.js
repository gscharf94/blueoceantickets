import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { router as mainPage } from './routes/mainPage.js';
import { router as viewJob } from './routes/viewJob.js';
import { router as searchTicket } from './routes/searchTicketPOST.js';
const app = express();
const PORT = 3000;
app.set('view engine', 'pug');
app.set('views', path.join(path.dirname(''), 'views'));
app.locals.basedir = "/";
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use('/', mainPage);
app.use('/job', viewJob);
app.use('/searchTicket', searchTicket);
app.use(cors());
app.listen(PORT, () => {
    console.log(`listening at http://192.168.86.36:${PORT}`);
});
