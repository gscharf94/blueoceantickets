import puppeteer from 'puppeteer';
const PHONENUMBER = "7816584401";
const URL = "https://exactix.sunshine811.com/findTicketByNumberAndPhone";
/**
 * regex for description results in ugliness
 * this trims away all the new lines and leaves one nice description string
 * @param {string} description - locate description for locate
 */
function trimDescription(description) {
    description = description.slice(0, -2);
    description = description.replaceAll("\n", " ");
    description = description.replaceAll("'", "''");
    return description;
}
/**
 * turns "my name's gustavo" into
 *       "my name''s gustavo"
 * this way it can be escaped in postgresql
 * @param {string} txt - arbritary string to escape single quote
 */
function escapeSingleQuote(txt) {
    return txt.replaceAll("'", "''");
}
/**
 * page should be set to view a current ticket. it will go through the table of responses
 * and return a list of Response objects
 * @param {puppeteer.Page} page - page object
 */
async function getResponses(page) {
    let responses = await page.evaluate(() => {
        const tableSelector = "body > app-root > div > desktop-root > div > mat-sidenav-container > mat-sidenav-content > div > ng-component > div.page-content > div:nth-child(3) > ticket-anon-simple-view > div > ticket-details-printing-text-and-service-areas > iq-view-list > div.iq-list-items";
        const cellSelector = ".column-fixed";
        let table = document.querySelector(tableSelector);
        let rows = table.querySelectorAll('.iq-list-item');
        let responses = [];
        for (const row of rows) {
            console.log(row);
            let cells = row.querySelectorAll(cellSelector);
            let response = {
                utility_name: cells[1].textContent.slice(0, -6).trim(),
                utility_type: cells[2].textContent.trim(),
                contact: cells[3].textContent.trim(),
                alternate_contact: cells[4].textContent.trim(),
                emergency_contact: cells[5].textContent.trim(),
                response: cells[6].textContent.trim(),
                notes: cells[7].textContent.trim(),
            };
            responses.push(response);
        }
        return responses;
    });
    for (const response of responses) {
        for (const item in response) {
            response[item] = escapeSingleQuote(response[item]);
        }
    }
    return responses;
}
/**
 * uses regex to parse the raw ticket text and get the pertinent information from each ticket
 * @param {string} text - the full textContent from the ticketInfo element
 */
function parseTicketText(text) {
    let ticketNumberRegex = /Ticket : (\d{9})/;
    let ticketNumberResult = text.match(ticketNumberRegex);
    let streetRegex = /Street  : (.*)/;
    let streetResult = text.match(streetRegex);
    let crossStreetRegex = /Cross 1 : (.*)/;
    let crossStreetResult = text.match(crossStreetRegex);
    let callInDateRegex = /Taken: (\d{2}\/\d{2}\/\d{2})/;
    let callInDateResult = text.match(callInDateRegex);
    let expDateRegex = /Exp Date : (\d{2}\/\d{2}\/\d{2})/;
    let expDateResult = text.match(expDateRegex);
    let descriptionRegex = /Locat: ([\s\d\w\(\)\,\.\&\'\"\-\/]*):/;
    let descriptionResult = text.match(descriptionRegex);
    let cityRegex = /GeoPlace: (.*)/;
    let cityResult = text.match(cityRegex);
    let remarksRegex = /Remarks : (.*)/;
    let remarksResult = text.match(remarksRegex);
    return {
        ticket_number: ticketNumberResult[1],
        city: escapeSingleQuote(cityResult[1]),
        street: escapeSingleQuote(streetResult[1]),
        cross_street: escapeSingleQuote(crossStreetResult[1]),
        input_date: new Date(callInDateResult[1]),
        expiration_date: new Date(expDateResult[1]),
        description: trimDescription(descriptionResult[1]),
        job_name: remarksResult[1].split(" ")[0],
        pl_number: Number(remarksResult[1].slice(-2)),
    };
}
/**
 * basically the main function of this file, it takes a ticket number and
 * parses all the ticket text as well as gets the responses.
 * @param {string} ticketNumber - needs to be a string because it could end in 0
 */
export async function getTicketInfo(ticketNumber) {
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
    browser.close();
    return {
        ticket_number: parsedText.ticket_number,
        city: parsedText.city,
        street: parsedText.street,
        cross_street: parsedText.cross_street,
        input_date: parsedText.input_date,
        expiration_date: parsedText.expiration_date,
        job_name: parsedText.job_name,
        responses: responses,
        description: parsedText.description,
        pl_number: parsedText.pl_number,
    };
}
