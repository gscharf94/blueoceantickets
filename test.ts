import { getTicketInfo } from "./tickets/checkTicket.js";
import { addTicket } from "./addTicket.js";


const ticketNumber = "143204143";


(async () => {
  let info = await getTicketInfo(ticketNumber);
  console.log(info);

  addTicket(info);
})();

