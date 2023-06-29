// Store our API endpoint as queryUrl*
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Create popup with additional iformation
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Where: " + feature.properties.place +
      "</h3><hr><p>" + "When: "+ new Date(feature.properties.time) + "</p>" + "<br><h3> Magnitude: " + feature.properties.mag + "</h3>");
  }

 // Create a GeoJSON layer containing the features array
 function createMarker(feature,latlng){
  let options = {
      radius:feature.properties.mag*5,
      fillColor: chooseColor(feature.properties.mag),
      color: chooseColor(feature.properties.mag),
      weight: 1,
      opacity: .5,
      fillOpacity: 1
  }
  return L.circleMarker(latlng, options);
}

let earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature,
  pointToLayer: createMarker
});

// Send earthquakes layer to the createMap function
createMap(earthquakes);
}

// Color circles based on mag
function chooseColor(mag) {
      if (0.1 <= mag && mag <= 1.0) return "Plum";
      else if (1.0 <= mag && mag <= 2.5) return "Orchid";
      else if (2.5 <= mag && mag <= 4.0) return "MediumOrchid";
      else if (4.0 <= mag && mag <= 5.5) return "DarkViolet";
      else if (5.5 <= mag && mag <= 8.0) return "RebeccaPurple";
      else if (8.0 <= mag && mag <= 20.0) return "Indigo";
}

// Set up the legend.
var legend = L.control({ position: "bottomleft"});

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Earthquake Magnitude</h4>";
  div.innerHTML += '<i style="background: Plum"></i><span>0.1 - 1.0</span><br>';
  div.innerHTML += '<i style="background: Orchid"></i><span>1.0 - 2.5</span><br>';
  div.innerHTML += '<i style="background: MediumOrchid"></i><span>2.5 - 4.0</span><br>';
  div.innerHTML += '<i style="background: DarkViolet"></i><span>4.0 - 5.5</span><br>';
  div.innerHTML += '<i style="background: RebeccaPurple"></i><span>5.5 - 8.0</span><br>';
  div.innerHTML += '<i style="background: Indigo"></i><span>8.0 +</span><br>';

  return div;

};

function createMap(earthquakes){

// Create the tile layer that will be the background of our map.
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


// Create a baseMaps object to hold the streetmap layer.
var baseMaps = {
"Street Map": streetmap
};

// Create an overlayMaps object to hold the bikeStations layer.
var overlayMaps = {
"Earthquakes": earthquakes
};

// Create the map object with options, zooming and centering to see the whole world on the map
var map = L.map("map", {
center: [19.432080, -4.814873],
zoom: 3,
layers: [streetmap, earthquakes]
});

 // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
 L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(map);

legend.addTo(map);
}






