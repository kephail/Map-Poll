var gatheredData = {};
var hasClicked = false;
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
        gatheredData.currentLatitude       = position.coords.latitude;
        gatheredData.currentLongitude      = position.coords.longitude;
        gatheredData.currentCountry        = res.formatted_address;
        gatheredData.currentCountryLong    = res.geometry.location.lng;
        gatheredData.currentCountryLat     = res.geometry.location.lat;
      }
    });
  });
}

var Map = React.createClass({
  getInitialState: function () {
    return {map: null};
  },
  componentDidMount: function () {
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
    this.setState({map: this.map});

    map.on('click', this.onMapClick);
    map.fitWorld();
  },
  componentWillUnmount: function () {
    this.map.off('click', this.onMapClick);
    this.map = null;
  },
  onMapClick: function (e) {
    var that = this;
    getCountry(e.latlng.lng, e.latlng.lat, function (err, res) {
      if (err) {
        console.log(err);
      }
      else {
        gatheredData.selectedLongitude     = e.latlng.lng;
        gatheredData.selectedLatitude      = e.latlng.lat;
        gatheredData.selectedCountry       = res.formatted_address;
        gatheredData.selectedCountryLong   = res.geometry.location.lng;
        gatheredData.selectedCountryLat    = res.geometry.location.lat;
        if (!hasClicked) {
          addAnswer(gatheredData, function (err, res) {
            hasClicked = true;
            console.log("Answer stored");
            if (!err) {
              drawLines(res, that.map);
            }
          });
        }
      }

    });
  },
  render: function() {
    return (
      <div className='map'></div>
    );
  }
});

function drawLines (gatheredData, map){
  var current = {
      fromLat: gatheredData.currentCountryLat,
      fromLong: gatheredData.currentCountryLong,
      toLat: gatheredData.selectedCountryLat,
      toLong: gatheredData.selectedCountryLong
    }
  drawLine(gatheredData, map);

  $.ajax({
    url: "/api/getAnswers",
    type: "GET",
    dataType: 'json',
    cache: false,
    success: function (data) {
      for (var i = 0; i < data.length; i++) {
        drawLine(data[i], map);
      }
    },
    error: function (xhr, status, err) {
    }
  });

}

function drawLine (answer, map) {
  var point1 = L.latLng(answer.currentCountryLat, answer.currentCountryLong);
  var point2 = L.latLng(answer.selectedCountryLat, answer.selectedCountryLong);
  var line_points = [point1, point2];

  // Define polyline options
  // http://leafletjs.com/reference.html#polyline
  var polyline_options = {
      color: '#000',
      weight: 2,
      opacity: .2
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
  $.ajax({
    url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+ lat + "," + long + "&sensor=true",
    dataType: 'json',
    cache: false,
    success: function(data) {
      var components = data.results[data.results.length-1];
        // .map(function (result) {
        //   return result.address_components;
        // })
        // .reduce(function (a, b) {
        //   return a.concat(b);
        // }, [])
        // .filter(function (component) {
        //   return component.types.indexOf('country') !== -1;
        // })[0];

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
