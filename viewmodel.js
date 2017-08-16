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
class PlaceModel{

  constructor(place) {
    this.name = place.name;
    this.lat = place.lat;
    this.lng = place.lng;
    this.checkins = place.checkins;

    // Create the map marker for this SubwayStation object
    this.mapMarker = new google.maps.Marker({
        position: {lat: this.lat, lng: this.lng},
        map: map,
        title: this.name
    });

    // Create the info window for this  object
    this.infoWindow = new google.maps.InfoWindow();


    this.showInfoWindow = () => {
        // Build the basic info window content, if hasn't been done
        if (!this.infoWindow.getContent()) {
            // Initialize basic info window content and display it
            this.infoWindow.setContent('Loading content...');
            let content = '<h3>' + this.name + '</h3>';
            content += '<p>Check-ins: ' + this.checkins + '</p>';
            this.infoWindow.setContent(content);
        }

        // Show info window
        this.infoWindow.open(map, this.mapMarker);
    };

    this.showInfoWindow();


    this.mapMarker.setAnimation(google.maps.Animation.BOUNCE);

    // this.infoWindow.open(map, this.mapMarker);

    // this.mapMarker.setAnimation(null);
    // this.infoWindow.close();


    /*
    Don't want all of them to open by default, just
    when one is clicked. Therefore query and close any other peer 
    PlaceModel objects
    */
    // self.infoWindow.open(map, self.mapMarker);
  }
}


/*
1. Uses Fetch to pull in a list of venues from Foursquare.
2. Assigns the array result to this.placeList in Knockout observable array.
3. Sets up individual PlaceModel with methods to filter & show specific place(s)
*/
class PlaceViewModel {        
  constructor(){
    this.placeList = ko.observableArray([]);
    this.filter = ko.observable('');
    this.isVisible = ko.observable(true);

    // Use Filter Here - Knockout computed observable
    // KeyUp binding equivalent is via Knockout

    getfsdata((result) => {
      console.log("result is, ", result);
      // Grab the FourSquare venue list and push to the placeList observable array.
      // Simultaneously, we instantiate a PlaceModel object
      // Each placeModel will be able to set its own Google Map properties.
      result.forEach((obj) => {
        this.placeList.push( new PlaceModel(obj) );
      })
    });
  }

  hello(){
    console.log("Hola!");
  }
}

// ko.applyBindings(new PlaceListViewModel());
var vm = new PlaceViewModel();
ko.applyBindings(vm);
// vm.hello();

let map;

// initMap = function() vs. function initMap()
// This has to do with scopes and hoisting

// This is global where WebPack is involved
window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 49.2827, lng: -123.1207},
        zoom: 16
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
