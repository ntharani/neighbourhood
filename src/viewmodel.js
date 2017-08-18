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
    alert("API Request to FourSquare failed");
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

    this.mapMarker.addListener('click', () => {
      vm.hideWindows();
      this.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => { this.mapMarker.setAnimation(null); }, 1500);
      map.panTo({lat: this.lat, lng: this.lng});
      this.infoWindow.open(map, this.mapMarker);

    })

  }

  hideInfoWindow(){
    this.mapMarker.setAnimation(null);
    this.infoWindow.close();
  }

  showInfoWindow(){
    let content = '<h3>' + this.name + '</h3>';
    content += '<p>Check-ins: ' + this.checkins + '</p>';
    this.infoWindow.setContent(content);

    // Show info window
    this.mapMarker.setAnimation(google.maps.Animation.DROP);
    // If using bounce, just stop the animation.
    // setTimeout(function(){ marker.setAnimation(null); }, 750);

    this.infoWindow.open(map, this.mapMarker);
    };
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

    this.hello = this.hello.bind(this);
    // this.filter = this.filter.bind(this);
    // this.filterResults = this.filterResults.bind(this);

    // Can't get this to work when I take it out of the constructor? 
    this.filterResults = ko.computed( () => {
        let matches = [];
        // Create a regular expression for performing a case-insensitive
        // search using the current value of the filter observable
        let re = new RegExp(this.filter(), 'i');

        // Iterate over all place objects, searching for a matching name
        this.placeList().forEach((place) => {
            // If it's a match, save it to the list of matches and show its
            // corresponding map marker
            if (place.name.search(re) !== -1) {
                matches.push(place);
                place.mapMarker.setVisible(true);
                this.hideWindows();
                place.showInfoWindow();

            // Otherwise, ensure the corresponding map marker is hidden
            } else {
                // Hide marker
                place.mapMarker.setVisible(false);

            }
        });
        return matches;
    });

    this.sayBye = () => {
        console.log("Howdy, I'm the parent");        
    }

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

  hideWindows(){
    console.log("hiding all Infowindows");
    // Is there a more efficient way that continually iterating over this each time?
    this.placeList().forEach((obj) => {
      obj.hideInfoWindow();
    })
  }

// hello = (place) => // doesn't work, which feature?
// need to use bind above.
  hello(place) {
    console.log("Hola! ", place.name);
    this.hideWindows();
    place.showInfoWindow();
  }

}

let map;

// initMap = function() vs. function initMap()
// This has to do with scopes and hoisting

// This is global where WebPack is involved
window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 49.2827, lng: -123.1207},
        zoom: 16
    });
    // console.log(map);
}

window.mapError = () => {
  alert("Trouble loading Google Maps. Please try again")
};

// This is only within functional scope. It is acceptable if WebPack isn't used.
// function initMap() {
//     map = new google.maps.Map(document.getElementById('map'), {
//         center: {lat: 49.2827, lng: -123.1207},
//         zoom: 15
//     });
//     console.log(map);
// }

// ko.applyBindings(new PlaceListViewModel());
var vm = new PlaceViewModel();
ko.applyBindings(vm);
// vm.hideWindows();
