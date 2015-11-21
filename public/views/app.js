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
        console.log(res);
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

        map.on('click', this.onMapClick);
        map.fitWorld();
    },
    componentWillUnmount: function() {
        this.map.off('click', this.onMapClick);
        this.map = null;
    },
    onMapClick: function(e) {
        getCountry(e.latlng.lng, e.latlng.lat, function (err, res) {
          if (err) {
            console.log(err);
          }
          else {
            console.log(res);
            gatheredData.selectedLongitude     = e.latlng.lng;
            gatheredData.selectedLatitude      = e.latlng.lat;
            gatheredData.selectedCountry       = res.long_name;
            gatheredData.selectedCountryShort  = res.short_name;
            addAnswer(gatheredData);
          }
        });

    },
    render: function() {
        return (
            <div className='map'></div>
        );
    }
});

function addAnswer (data) {
  $.ajax({
    url: "/api/addAnswer",
    type: "POST",
    dataType: 'json',
    data: data,
    cache: false,
    success: function (data) {

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
