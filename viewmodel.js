import 'whatwg-fetch'
import Promise from 'promise-polyfill'; 

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

const FOURSQ_CLIENT_ID = "W40TGAOG1505I3W4FJGKJIOCXWU22EG33OVA0M3LKI3G45HO";
const FOURSQ_CLIENT_SECRET = "4LHO1EKA2ENAWWAX2E31BWUQG2I5GCSJKOSFJJCT4Y2XGZBL";

// let googleMapsClient = require('@google/maps').createClient({
//   key: 'AIzaSyDWAtCG4fzvlkJQpUGxeT-JndYmZCaKsvU'
// })

const getVenues = "https://api.foursquare.com/v2/venues/explore?v=20131016&ll=49.2827%2C-123.1207&section=food&novelty=new&client_id=";
let ans = getVenues+FOURSQ_CLIENT_ID + "&client_secret=" + FOURSQ_CLIENT_SECRET;

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    let error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  return response.json()
}

function getfsdata(callback) {
  fetch(ans)
    .then(checkStatus)
    .then(parseJSON)
    .then(function(data) {
      console.log('request succeeded with JSON response', data)
      const choices = data.response.groups[0].items;
      const ans2 = choices.map(function(obj){
          let resp = { 
              name: obj.venue.name,
              lat: obj.venue.location.lat,
              lng: obj.venue.location.lng,
              checkins: obj.venue.stats.checkinsCount
          }
          return resp;
      })
      console.log("choices is,", ans2);
      callback(ans2)
    }).catch(function(error) {
      console.log('request failed', error)
    })
}

/*
Creates a Google Maps Marker object with data pulled in from
PlaceListViewModel
*/
function PlaceModel(place){
  let self = this;
  self.name = place.name;
  self.lat = place.lat;
  self.lng = place.lng;
  self.checkins = place.checkins;

  // Create the map marker for this SubwayStation object
  self.mapMarker = new google.maps.Marker({
      position: {lat: self.lat, lng: self.lng},
      map: map,
      title: self.name
  });

  // Create the info window for this  object
  self.infoWindow = new google.maps.InfoWindow();

  self.mapMarker.setAnimation(google.maps.Animation.BOUNCE);

self.infoWindow.open(map, self.mapMarker);

  self.mapMarker.setAnimation(null);
  self.infoWindow.close();


  /*
  Don't want all of them to open by default, just
  when one is clicked. Therefore query and close any other peer 
  PlaceModel objects
  */
  // self.infoWindow.open(map, self.mapMarker);

}


/*
1. Uses Fetch to pull in a list of venues from Foursquare.
2. Assigns the array result to self.place in Knockout observable array.
3. Sets up individual PlaceModel
4. Has methods to filter and show specific place(s)
*/
function PlaceListViewModel() {
    let self = this;
        
    // By default this will contain everything fetched from JSON
    self.place = ko.observableArray([]);

    self.filter = ko.observable('');
    self.isVisible = ko.observable(true);



    // Use Filter Here - Knockout computed observable
    // KeyUp binding equivalent is via Knockout

    getfsdata(function(result){
      console.log("result is, ",result);
      // Here we set the push this FourSquare venue list to the observable array.
      self.place(result);
      // Simultaneously, we instantiate a PlaceModel object from our PlaceListViewModel
      // Each place will be able to set its own Google Map properties.
      result.forEach((obj) => {
        new PlaceModel(obj);
      })
    });
    
}

// ko.applyBindings(new PlaceListViewModel());
var vm = new PlaceListViewModel();
ko.applyBindings(vm);

let map;

// initMap = function() vs. function initMap()
// This has to do with scopes and hoisting

// This is global where WebPack is involved
window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 49.2827, lng: -123.1207},
        zoom: 15
    });
    console.log(map);
}

// This is only within functional scope. It is acceptable if WebPack isn't used.
// function initMap() {
//     map = new google.maps.Map(document.getElementById('map'), {
//         center: {lat: 49.2827, lng: -123.1207},
//         zoom: 15
//     });
//     console.log(map);
// }
