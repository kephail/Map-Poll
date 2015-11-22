var gatheredData = {};
function init () {
  gatheredData = {
    currentLongitude:     0,
    currentLatitude:      0,
    currentCountry:       "",
    currentCountryShort:  "",
    selectedLongitude:    0,
    selectedLatitude:     0,
    selectedCountry:      "",
    selectedCountryShort: ""
  }
  navigator.geolocation.getCurrentPosition(function(position) {
    getCountry(position.coords.longitude, position.coords.latitude, function (err, res) {
      if (err) {
        console.log(err);
      }
      else {
        gatheredData.currentCountry = res.long_name;
        gatheredData.currentCountryShort = res.short_name;
        gatheredData.currentLatitude = position.coords.latitude;
        gatheredData.currentLongitude = position.coords.longitude;
      }
    });
  });
}

var Map = React.createClass({
    componentDidMount: function() {
        var map = this.map = L.map(ReactDOM.findDOMNode(this), {
            minZoom: 2,
            maxZoom: 2,
            layers: [
                L.tileLayer(
                    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
            ],
            attributionControl: false,
        });

        map.on('click', this.onMapClick, this);
        map.fitWorld();
    },
    componentWillUnmount: function() {
        this.map.off('click', this.onMapClick);
        this.map = null;
    },
    onMapClick: function(e, map) {
        getCountry(e.latlng.lng, e.latlng.lat, function (err, res) {
          if (err) {
            console.log(err);
          }
          else {
            gatheredData.selectedLongitude     = e.latlng.lng;
            gatheredData.selectedLatitude      = e.latlng.lat;
            gatheredData.selectedCountry       = res.long_name;
            gatheredData.selectedCountryShort  = res.short_name;
            addAnswer(gatheredData, function (err, res) {
              console.log("Answer stored");
              if (!err) {

              }
            });
          }

        });

    },
    render: function() {
        return (
            <div className='map'></div>
        );
    }
});

// var displayQuestion = React.createClass({
//   $.ajax({
//     url: "/api/getQuestion",
//     type: "GET",
//     dataType: 'json',
//     data: data,
//     cache: false,
//     success: function (data) {
//
//     },
//     error: function (xhr, status, err) {
//       return callback(err.toString(), null);
//     }
//   });
// });
function drawLines(gatheredData, map){
  var point1 = L.latLng(36.87962060502676, 90.3515625);
  var point2 = L.latLng(50.794602499999996, 1.0954658);
  var line_points = [point1, point2];

  // Define polyline options
  // http://leafletjs.com/reference.html#polyline
  var polyline_options = {
      color: '#000'
  };

  // Defining a polygon here instead of a polyline will connect the
  // endpoints and fill the path.
  // http://leafletjs.com/reference.html#polygon
  var polyline = L.polyline(line_points, polyline_options).addTo(map);
}

function addAnswer (data, callback) {
  $.ajax({
    url: "/api/addAnswer",
    type: "POST",
    dataType: 'json',
    data: data,
    cache: false,
    success: function (data) {
      return callback(null, data);
    },
    error: function (xhr, status, err) {
      return callback(err.toString(), null);
    }
  });
}

function getCountry(long, lat, callback){
  console.log(long)
  console.log(lat)

  $.ajax({
    url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+ lat + "," + long + "&sensor=true",
    dataType: 'json',
    cache: false,
    success: function(data) {
      var components = data.results
        .map(function (result) {
          return result.address_components;
        })
        .reduce(function (a, b) {
          return a.concat(b);
        }, [])
        .filter(function (component) {
          return component.types.indexOf('country') !== -1;
        })[0];
      return callback(null, components);
    },
    error: function(xhr, status, err) {
      return callback(err.toString(), null);
    }
  });
}

ReactDOM.render(
  React.createElement(Map, null),
  document.getElementById('content')
);

init();
