import * as viewmodel from "./viewmodel.js";

let map;
window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 49.2827, lng: -123.1207},
        zoom: 15
    });
    console.log(map);
}

// viewmodel.getfsdata(function(nnn){
//     console.log('nnn', nnn.length);
//     render();
// }); // Fetches the data
// console.log("Le response mon ami, ", viewmodel.nnn.length);
// console.log("Le response mon ami 2, ", viewmodel.nnn[0]);
// function render(){
// // Overall viewmodel for this screen, along with initial state

