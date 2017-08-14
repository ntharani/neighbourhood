import * as viewmodel from "./viewmodel.js";

var map;
window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 49.2827, lng: -123.1207},
        zoom: 15
    });
    console.log(map);
}

viewmodel.getfsdata();
console.log("Le response mon ami, ", viewmodel.nnn);


// Overall viewmodel for this screen, along with initial state
function PlaceObjectViewModel() {
    var self = this;
        
    let xx =  
        [
            {name: "Hubbub Sandwiches", lat: 49.282078, lng: -123.12287, checkins: 3508},
            {name: "Japadog", lat: 49.28318583609762, lng: -123.12276455990715, checkins: 2694},
            {name: "Tacofino Cantina", lat: 49.282394974979276, lng: -123.12094607150951, checkins: 502},
            {name: "Italian Kitchen", lat: 49.284456, lng: -123.122105, checkins: 4247},
            {name: "Mom's Grilled Cheese Truck", lat: 49.28224303303845, lng: -123.1207455787171, checkins: 1163},
            {name: "Shuraku Sake Bar and Bistro", lat: 49.28102573386839, lng: -123.12047300498325, checkins: 2277},
            {name: "JOEY Burrard", lat: 49.28288439342585, lng: -123.12340983872221, checkins: 5671},
            {name: "Vancouver Art Gallery Cafe", lat: 49.28261607531749, lng: -123.12090396881104, checkins: 2164}
        ];
        
        console.log("Typeof xx is: ",typeof(xx));


    // Editable data
    self.place = ko.observableArray(xx
        // [
        //     {name: "Hubbub Sandwiches", lat: 49.282078, lng: -123.12287, checkins: 3508},
        //     {name: "Japadog", lat: 49.28318583609762, lng: -123.12276455990715, checkins: 2694},
        //     {name: "Tacofino Cantina", lat: 49.282394974979276, lng: -123.12094607150951, checkins: 502},
        //     {name: "Italian Kitchen", lat: 49.284456, lng: -123.122105, checkins: 4247},
        //     {name: "Mom's Grilled Cheese Truck", lat: 49.28224303303845, lng: -123.1207455787171, checkins: 1163},
        //     {name: "Shuraku Sake Bar and Bistro", lat: 49.28102573386839, lng: -123.12047300498325, checkins: 2277},
        //     {name: "JOEY Burrard", lat: 49.28288439342585, lng: -123.12340983872221, checkins: 5671},
        //     {name: "Vancouver Art Gallery Cafe", lat: 49.28261607531749, lng: -123.12090396881104, checkins: 2164}
        // ]        
    );

    // let interim = [];
    // (viewmodel.nnn).forEach((obj) => interim.push(obj) )
    // console.log("interim is, ",interim );
    // self.place(viewmodel.nnn);

    // Is there a reason this code below doesn't work?
    // (viewmodel.nnn).forEach((obj) => (self.place).push(obj));
    console.log("vm is,", viewmodel.nnn);
    console.log("self.place is,", self.place());    
}

ko.applyBindings(new PlaceObjectViewModel());

        // {name: "Hubbub Sandwiches", lat: 49.282078, lng: -123.12287, checkins: 3508},
        // {name: "Japadog", lat: 49.28318583609762, lng: -123.12276455990715, checkins: 2694},
        // {name: "Tacofino Cantina", lat: 49.282394974979276, lng: -123.12094607150951, checkins: 502},
        // {name: "Italian Kitchen", lat: 49.284456, lng: -123.122105, checkins: 4247},
        // {name: "Mom's Grilled Cheese Truck", lat: 49.28224303303845, lng: -123.1207455787171, checkins: 1163},
        // {name: "Shuraku Sake Bar and Bistro", lat: 49.28102573386839, lng: -123.12047300498325, checkins: 2277},
        // {name: "JOEY Burrard", lat: 49.28288439342585, lng: -123.12340983872221, checkins: 5671},
        // {name: "Vancouver Art Gallery Cafe", lat: 49.28261607531749, lng: -123.12090396881104, checkins: 2164}

