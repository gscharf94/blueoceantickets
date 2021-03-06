import { pool } from './db.js';
import { formatDatePostgresql, formatResponsesPostgresql } from './helperFunctions/formattingFunctions.js';
// add comment
/**
 * adds a single ticket into the database
 * @param {TicketInfo} info - this includes all the information gotten from
 * getTicketInfo()
 */
export async function addTicket(info) {
    for (const row of info.responses) {
        console.log(row);
    }
    let query = `INSERT INTO tickets
                (
                  ticket_number,
                  city,
                  street,
                  cross_street,
                  input_date,
                  expiration_date,
                  job_name,
                  responses,
                  description,
                  pl_number
                ) VALUES
                (
                  '${info.ticket_number}',
                  '${info.city}',
                  '${info.street}',
                  '${info.cross_street}',
                  '${formatDatePostgresql(info.input_date)}',
                  '${formatDatePostgresql(info.expiration_date)}',
                  '${info.job_name}',
                  '${formatResponsesPostgresql(info.responses)}',
                  '${info.description}',
                  ${info.pl_number}
                );`;
    pool.query(query, (err, resp) => {
        if (err) {
            console.log(`error adding ticket: ${info.ticket_number}`);
            console.log(err);
        }
        else {
            console.log(`success adding ticket: ${info.ticket_number}`);
            console.log(resp);
        }
    });
}
