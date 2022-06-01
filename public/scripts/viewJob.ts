let map = L.map('map').setView([28.54, -81.391], 8);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'BLUEOCEAN',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiZ3NjaGFyZjk0IiwiYSI6ImNreWd2am9mODBjbnMyb29sNjZ2Mnd1OW4ifQ.1cSadM_VR54gigTAsVVGng'
}).addTo(map);


function toggleTicketPopup(): void {
  let popup = document.getElementById('addTicketPopup');
  popup.classList.toggle("show");
}

/**
 * displays the popup and fills it with information about specific ticket
 * after calling api to get server to check ticket
 * after this, get the user to draw the ticket on the map
 */
function addTicket(): void {
  toggleTicketPopup();
}