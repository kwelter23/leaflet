//URL 
// Significant earthquakes in the last 30 days
//var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
// All earthquakes in the last 7 days
var url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

/*// Grabbing our plates GeoJSON data..
d3.json(platesUrl, function(platesData) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(platesData.features);
});*/

// Grabbing our earthquake GeoJSON data..
d3.json(url, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake

    // Define a markerSize function that will give each city a different radius based on its population
    function markerSize(magnitude) {
        return magnitude * 3;
    }

    function markerColor(depth) {
        if (depth > 90) {
            return "red";
        }
        else if (depth > 70 && depth <= 90) {
            return "DarkOrange";
        }
        else if (depth > 50 && depth <= 70) {
            return "Orange";
        }
        else if (depth > 30 && depth <= 50) {
            return "GoldenRod";
        }
        else if (depth > 10 && depth <= 30) {
            return "GreenYellow";
        }
        else {
            return "green";
        }
    }

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    function createMarker(feature, latlng) {
        var myStyle = {
            radius: markerSize(feature.properties.mag),
            fillOpacity: 0.5,
            color: markerColor(feature.geometry.coordinates[2])
        }
        return new L.CircleMarker(latlng, myStyle)
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: createMarker,
        onEachFeature: onEachFeature
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Define layers
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v11",
        accessToken: API_KEY
    });
 
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        //"Tectonic Plates": tectonicPlates,
        "Earthquakes": earthquakes
    };

    // Create our map, giving it the satellite and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [15.5994, -28.6731],
        zoom: 1.5,
        layers: [satellite, earthquakes]
    });
   
    var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
 
var mapColors = ["green", "greenyellow", "goldenrod", "orange", "darkorange", "red"];
 
       //The labels for each color
       var labels = ["-10 - 10 km", "10 - 30 km", "30 - 50 km", "50 - 70 km", "70 - 90 km", "90+ km"];
 
       //Start the ordered list
       var list = '<ul style="list-style-type:none;"><li><b>Earthquake Depth</b></li>';
      
       //Create the div
       var div = L.DomUtil.create("div");
 
       //Add list item for each color
       labels.forEach(function(x, index) {
           list += '<li>' + '<span style="color:' + mapColors[index] + '; background-color:' + mapColors[index] + '">box</span>' +
           '<span style="color:black">' + '&nbsp&nbsp&nbsp' + labels[index] + '</span></li>';
       });
 
       //Finish off the list html
       div.innerHTML += list + "</ul>";
       return div;
  };
  // Adding legend to the map
  legend.addTo(myMap);

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


}