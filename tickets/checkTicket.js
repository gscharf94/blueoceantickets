"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getTicketInfo = void 0;
var puppeteer_1 = require("puppeteer");
var PHONENUMBER = "7816584401";
var URL = "https://exactix.sunshine811.com/findTicketByNumberAndPhone";
/**
 * regex for description results in ugliness
 * this trims away all the new lines and leaves one nice description string
 * @param {string} description - locate description for locate
 */
function trimDescription(description) {
    description = description.slice(0, -2);
    description = description.replace(/\n/g, " ");
    description = description.replace(/'/g, "''");
    return description;
}
/**
 * turns "my name's gustavo" into
 *       "my name''s gustavo"
 * this way it can be escaped in postgresql
 * @param {string} txt - arbritary string to escape single quote
 */
function escapeSingleQuote(txt) {
    return txt.replace(/'/g, "''");
}
/**
 * page should be set to view a current ticket. it will go through the table of responses
 * and return a list of Response objects
 * @param {puppeteer.Page} page - page object
 */
function getResponses(page) {
    return __awaiter(this, void 0, void 0, function () {
        var responses, _i, responses_1, response, item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.evaluate(function () {
                        var tableSelector = "body > app-root > div > desktop-root > div > mat-sidenav-container > mat-sidenav-content > div > ng-component > div.page-content > div:nth-child(3) > ticket-anon-simple-view > div > ticket-details-printing-text-and-service-areas > iq-view-list > div.iq-list-items";
                        var cellSelector = ".column-fixed";
                        var table = document.querySelector(tableSelector);
                        var rows = table.querySelectorAll('.iq-list-item');
                        var responses = [];
                        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                            var row = rows_1[_i];
                            console.log(row);
                            var cells = row.querySelectorAll(cellSelector);
                            var response = {
                                utility_name: cells[1].textContent.slice(0, -6).trim(),
                                utility_type: cells[2].textContent.trim(),
                                contact: cells[3].textContent.trim(),
                                alternate_contact: cells[4].textContent.trim(),
                                emergency_contact: cells[5].textContent.trim(),
                                response: cells[6].textContent.trim(),
                                notes: cells[7].textContent.trim()
                            };
                            responses.push(response);
                        }
                        return responses;
                    })];
                case 1:
                    responses = _a.sent();
                    for (_i = 0, responses_1 = responses; _i < responses_1.length; _i++) {
                        response = responses_1[_i];
                        for (item in response) {
                            response[item] = escapeSingleQuote(response[item]);
                        }
                    }
                    return [2 /*return*/, responses];
            }
        });
    });
}
/**
 * uses regex to parse the raw ticket text and get the pertinent information from each ticket
 * @param {string} text - the full textContent from the ticketInfo element
 */
function parseTicketText(text) {
    var ticketNumberRegex = /Ticket : (\d{9})/;
    var ticketNumberResult = text.match(ticketNumberRegex);
    var streetRegex = /Street  : (.*)/;
    var streetResult = text.match(streetRegex);
    var crossStreetRegex = /Cross 1 : (.*)/;
    var crossStreetResult = text.match(crossStreetRegex);
    var callInDateRegex = /Taken: (\d{2}\/\d{2}\/\d{2})/;
    var callInDateResult = text.match(callInDateRegex);
    var expDateRegex = /Exp Date : (\d{2}\/\d{2}\/\d{2})/;
    var expDateResult = text.match(expDateRegex);
    var descriptionRegex = /Locat: ([\s\d\w\(\)\,\.\&\'\"\-\/]*):/;
    var descriptionResult = text.match(descriptionRegex);
    var cityRegex = /GeoPlace: (.*)/;
    var cityResult = text.match(cityRegex);
    var remarksRegex = /Remarks : (.*)/;
    var remarksResult = text.match(remarksRegex);
    return {
        ticket_number: ticketNumberResult[1],
        city: escapeSingleQuote(cityResult[1]),
        street: escapeSingleQuote(streetResult[1]),
        cross_street: escapeSingleQuote(crossStreetResult[1]),
        input_date: new Date(callInDateResult[1]),
        expiration_date: new Date(expDateResult[1]),
        description: trimDescription(descriptionResult[1]),
        job_name: remarksResult[1].split(" ")[0],
        pl_number: Number(remarksResult[1].slice(-2))
    };
}
/**
 * basically the main function of this file, it takes a ticket number and
 * parses all the ticket text as well as gets the responses.
 * @param {string} ticketNumber - needs to be a string because it could end in 0
 */
function getTicketInfo(ticketNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, ticketNumberInputSelector, phoneNumberInputSelector, submitButtonSelector, ticketTextSelector, ticketText, parsedText, responses;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer_1["default"].launch({
                        headless: true,
                        slowMo: 100
                    })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    return [4 /*yield*/, page.goto(URL)];
                case 3:
                    _a.sent();
                    ticketNumberInputSelector = "#mat-input-0";
                    phoneNumberInputSelector = "#iq-phone-0 > input";
                    submitButtonSelector = ".mat-button > span:nth-child(1)";
                    return [4 /*yield*/, page.waitForSelector(ticketNumberInputSelector)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, page.focus(ticketNumberInputSelector)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, page.keyboard.type(ticketNumber, { delay: 50 })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, page.focus(phoneNumberInputSelector)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, page.keyboard.type(PHONENUMBER, { delay: 50 })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, page.click(submitButtonSelector)];
                case 9:
                    _a.sent();
                    ticketTextSelector = "body > app-root > div > desktop-root > div > mat-sidenav-container > mat-sidenav-content > div > ng-component > div.page-content > div:nth-child(3) > ticket-anon-simple-view > div > ticket-details-printing-text-and-service-areas > pre";
                    return [4 /*yield*/, page.waitForSelector(ticketTextSelector)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, page.$eval(ticketTextSelector, function (el) { return el.textContent; })];
                case 11:
                    ticketText = _a.sent();
                    parsedText = parseTicketText(ticketText);
                    return [4 /*yield*/, getResponses(page)];
                case 12:
                    responses = _a.sent();
                    browser.close();
                    return [2 /*return*/, {
                            ticket_number: parsedText.ticket_number,
                            city: parsedText.city,
                            street: parsedText.street,
                            cross_street: parsedText.cross_street,
                            input_date: parsedText.input_date,
                            expiration_date: parsedText.expiration_date,
                            job_name: parsedText.job_name,
                            responses: responses,
                            description: parsedText.description,
                            pl_number: parsedText.pl_number
                        }];
            }
        });
    });
}
exports.getTicketInfo = getTicketInfo;
