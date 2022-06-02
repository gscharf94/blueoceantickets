import express from 'express';
import { pool } from '../db.js';
import { getTicketInfo } from '../tickets/checkTicket.js';

export const router = express.Router();

router.post('/', (req, res, next) => {
  let data = req.body;
  console.log(data);
  let ticketNumber = data.ticket_number;

  (async () => {
    let ticketInfo = await getTicketInfo(ticketNumber);
    res.json(JSON.stringify(ticketInfo));
  })();
});
