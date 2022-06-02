"use strict";
exports.__esModule = true;
var L = require("leaflet");
var map = L.map('map').setView([28.54, -81.391], 8);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'BLUEOCEAN',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZ3NjaGFyZjk0IiwiYSI6ImNreWd2am9mODBjbnMyb29sNjZ2Mnd1OW4ifQ.1cSadM_VR54gigTAsVVGng'
}).addTo(map);
function toggleTicketPopup() {
    var popup = document.getElementById('addTicketPopup');
    popup.classList.toggle("show");
}
/**
 * takes a date str that was a date object before
 * turns that into a date, and formats it into
 * "MM/DD/YYYY" in order to be inserted into input (type="date")
 */
function formatDate(date) {
    date = new Date(date);
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var day = date.getDate();
    return "".concat(String(month).padStart(2, "0"), "/").concat(String(day).padStart(2, "0"), "/").concat(year);
}
/**
 * displays the popup and fills it with information about specific ticket
 * after calling api to get server to check ticket
 * after this, get the user to draw the ticket on the map
 */
function addTicket() {
    toggleTicketPopup();
    var fillTicketInfo = function (resp) {
        var info = JSON.parse(resp);
        console.log(info);
        var cityInput = document.getElementById('cityInput');
        var streetInput = document.getElementById('streetInput');
        var crossStreetInput = document.getElementById('crossStreetInput');
        var descriptionInput = document.getElementById('descriptionInput');
        var inputDateInput = document.getElementById('inputDateInput');
        var expirationDateInput = document.getElementById('expirationDateInput');
        cityInput.value = info.city;
        streetInput.value = info.street;
        crossStreetInput.value = info.cross_street;
        descriptionInput.value = info.description;
        inputDateInput.value = formatDate(info.input_date);
        expirationDateInput.value = formatDate(info.expiration_date);
    };
    sendPost('searchTicket', { ticket_number: '143204143' }, fillTicketInfo);
}
/**
 * sends a post post request and when there is a response, runs a callback
 * @param {string} url - relative url path to the post address on the website
 * @param {{}} body - this is the JSON object to send in the request
 * @param {(string) => void} callback - callback function that does something with response
 */
function sendPost(url, body, callback) {
    var req = new XMLHttpRequest();
    req.open("POST", "http://192.168.86.36:3000/".concat(url));
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.response);
        }
    };
    req.send(JSON.stringify(body));
}
