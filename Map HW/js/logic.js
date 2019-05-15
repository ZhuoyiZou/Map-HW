// Creating map object
  
  // Adding tile layer to the map
  var emerald = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.emerald",
    accessToken: API_KEY
  });
  

  var comic = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.comic",
    accessToken: API_KEY
  });


  var baseMaps = {
    LightTheme: emerald,
    ComicTheme: comic
  };

  var myMap = L.map("map", {
    center: [12.2502, 64.3372],
    zoom: 2,
    layers: emerald 
  });

  L.control.layers(baseMaps).addTo(myMap);

  // Define a markerSize function that will give each city a different radius based on its population
function markerSize(mag) {
  return mag * 100000;
}

  // Assemble API query URL
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
  
  // Grab the data with d3
  d3.json(url, function(response) {
  
    // Loop through data
    for (var i = 0; i < response.features.length; i++) {
      console.log(response.features[i].geometry.coordinates.slice(1,3));
      console.log(response.features[i].properties.mag)
      console.log(response.features[i].properties.place)

      // Conditionals for countries points
      var color = "";
      if (response.features[i].properties.mag > 0 & response.features[i].properties.mag < 1) {
        color = "GreenYellow"; 
      }
      else if (response.features[i].properties.mag > 1 & response.features[i].properties.mag < 2 ) {
        color = "LightYellow";
      }
      else if (response.features[i].properties.mag > 2 & response.features[i].properties.mag < 3) {
        color = "Moccasin";
      }
      else if (response.features[i].properties.mag > 3 & response.features[i].properties.mag < 4) {
        color = "Pink";
      }
      else if (response.features[i].properties.mag > 4 & response.features[i].properties.mag < 5) {
        color = "Salmon";
      }
      else {
        color = "Sienna";
      }
  
  
      // Set the data location property to a variable
      L.circle(response.features[i].geometry.coordinates.slice(1,3), {
        fillOpacity: 0.8,
        color: "white",
        fillColor: color,
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
        radius: markerSize(response.features[i].properties.mag)

      }).bindPopup("<h3>" + response.features[i].properties.place + "</h3> <hr> <h3>Magnitude: " + response.features[i].properties.mag + "</h3>").addTo(myMap);

    }

  });

  function getColor(d) {
    return d > 5 ? 'Sienna' :
           d > 4  ? 'Salmon' :
           d > 3  ? 'Pink' :
           d > 2  ? 'Moccasin' :
           d > 1  ? 'LightYellow':
           "GreenYellow";
}

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);