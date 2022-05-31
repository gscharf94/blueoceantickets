import puppeteer from 'puppeteer';

const PHONENUMBER = "7816584401";
const URL = "https://exactix.sunshine811.com/findTicketByNumberAndPhone";


type Position = {
  lat: number,
  lng: number,
}

type Response = {
  utility_name: string,
  utility_type: string,
  response: string,
  contact: string,
  alternate_contact: string,
  emergency_contact: string,
  notes: string,
}

interface TicketInfo {
  ticket_number: string,
  city: string,
  street: string,
  cross_street: string,
  input_date: Date,
  expiration_date: Date,
  job_name: string,
  pl_number: number,
  description: string,
  responses: Response[],
  coordinates?: Position[],
}

async function getResponses(page: puppeteer.Page): Promise<Response[]> {
  let responses = await page.evaluate(() => {
    const tableSelector = "body > app-root > div > desktop-root > div > mat-sidenav-container > mat-sidenav-content > div > ng-component > div.page-content > div:nth-child(3) > ticket-anon-simple-view > div > ticket-details-printing-text-and-service-areas > iq-view-list > div.iq-list-items";
    const cellSelector = ".column-fixed";
    let table = document.querySelector(tableSelector);
    let rows = table.querySelectorAll('.iq-list-item');

    let responses: Response[] = [];

    for (const row of rows) {
      console.log(row);
      let cells = row.querySelectorAll(cellSelector);

      let response: Response = {
        utility_name: cells[1].textContent.slice(0, -6).trim(),
        utility_type: cells[2].textContent.trim(),
        contact: cells[3].textContent.trim(),
        alternate_contact: cells[4].textContent.trim(),
        emergency_contact: cells[5].textContent.trim(),
        response: cells[6].textContent.trim(),
        notes: cells[7].textContent.trim(),
      }
      responses.push(response);
    }
    return responses;
  });

  return responses;
}

function parseTicketText(text: string): { ticket_number: string, city: string, street: string, cross_street: string, input_date: Date, expiration_date: Date, description: string, job_name: string, pl_number: number } {
  return {
    ticket_number: 'test',
    city: 'fdfj',
    street: 'str',
    cross_street: 'jifd',
    input_date: new Date(),
    expiration_date: new Date(),
    description: 'jifd',
    job_name: 'str',
    pl_number: 1,
  }
}


async function getTicketInfo(ticketNumber: string): Promise<TicketInfo> {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(URL);

  const ticketNumberInputSelector = "#mat-input-0";
  const phoneNumberInputSelector = "#iq-phone-0 > input";
  const submitButtonSelector = ".mat-button > span:nth-child(1)";

  await page.waitForSelector(ticketNumberInputSelector);
  await page.focus(ticketNumberInputSelector);
  await page.keyboard.type(ticketNumber, { delay: 50 });


  await page.focus(phoneNumberInputSelector);
  await page.keyboard.type(PHONENUMBER, { delay: 50 });

  await page.click(submitButtonSelector);


  const ticketTextSelector = "body > app-root > div > desktop-root > div > mat-sidenav-container > mat-sidenav-content > div > ng-component > div.page-content > div:nth-child(3) > ticket-anon-simple-view > div > ticket-details-printing-text-and-service-areas > pre";
  await page.waitForSelector(ticketTextSelector);
  let ticketText = await page.$eval(ticketTextSelector, el => el.textContent);
  let parsedText = parseTicketText(ticketText);

  const responses = await getResponses(page);
  console.log(responses);



  setTimeout((br) => {
    browser.close();
  }, 1000000, browser)

  return {
    ticket_number: parsedText.ticket_number,
    city: parsedText.city,
    street: parsedText.street,
    cross_street: parsedText.cross_street,
    input_date: parsedText.input_date,
    expiration_date: parsedText.expiration_date,
    job_name: parsedText.job_name,
    responses: [],
    description: parsedText.description,
    pl_number: parsedText.pl_number,
  }
}

getTicketInfo('143204279');