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
  console.log("I'm a transactin here..")
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
          // nnn.push(resp);
          return resp;
      })
      console.log("choices is,", ans2);
      callback(ans2)
    }).catch(function(error) {
      console.log('request failed', error)
    })
}

function PlaceObjectViewModel() {
    let self = this;
        
    self.place = ko.observableArray([]);

    let x = getfsdata(function(result){
      console.log("result is, ",result);
      self.place(result);
    });

    console.log("x is, :", x); // fails

    self.place(x); // fails

    console.log("self.place is,", self.place());    
}

ko.applyBindings(new PlaceObjectViewModel());
