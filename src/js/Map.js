
const Map = React.createClass({
  getInitialState: function () {
    return {
      map: null,
      loaded: false,
      error: '',
      hasClicked: false,
      gatheredData: {
        currentLongitude:     0,
        currentLatitude:      0,
        currentCountry:       "",
        currentCountryShort:  "",
        selectedLongitude:    0,
        selectedLatitude:     0,
        selectedCountry:      "",
        selectedCountryShort: ""
      }
    };
  },
  componentWillMount: function () {
    navigator.geolocation.getCurrentPosition( (position) => {
      this.getCountry(position.coords.longitude, position.coords.latitude, (err, res) => {
        if (err) {
          console.log(err);
        }
        else {
          this.setState({
            gatheredData: {
              ...this.state.gatheredData,
              currentLatitude: position.coords.latitude,
              currentLongitude: position.coords.longitude,
              currentCountry: res.formatted_address,
              currentCountryLong: res.geometry.location.lng,
              currentCountryLat: res.geometry.location.lat
            }
          });
          this.setState({ loaded: true })
        }
      });
    });
  },
  componentDidMount: function () {
    var map = this.map = L.map(ReactDOM.findDOMNode(this), {
      minZoom: 2,
      maxZoom: 2,
      zoomControl: false,
      attributionControl: false,
      layers: [
        L.tileLayer(
          'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
          {
            attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            accessToken: "pk.eyJ1IjoiYmVuaGFycmlzIiwiYSI6IkRFY0xmeEUifQ.b0F3crnk3HJF_5YqtOXfsQ",
            id: "benharris.f5cdc064"
          }
        )
      ]
    });
    map.scrollWheelZoom.disable();
    map.touchZoom.disable();
    map.dragging.disable();
    this.setState({map: this.map});

    map.on('click', this.onMapClick);
    map.fitWorld();
  },
  componentWillUnmount: function () {
    this.map.off('click', this.onMapClick);
    this.map = null;
  },
  onMapClick: function (e) {
    this.getCountry(e.latlng.lng, e.latlng.lat, (err, res) => {
      if (err) {
        console.log(err);
      }
      else {
        this.setState({
          gatheredData: {
            ...this.state.gatheredData,
            selectedLongitude: e.latlng.lng,
            selectedLatitude: e.latlng.lat,
            selectedCountry: res.formatted_address,
            selectedCountryLong: res.geometry.location.lng,
            selectedCountryLat: res.geometry.location.lat
          }
        });

        if (!this.state.hasClicked && this.state.loaded === true) {
          this.addAnswer((err, res) => {
            this.setState({hasClicked: true})
            console.log("Answer stored", res);
            if (!err) {
              this.drawLines();
            }
          });
        }
      }

    });
  },
  getCountry: function (long, lat, callback){
    $.ajax({
      url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+ lat + "," + long + "&sensor=true",
      dataType: 'json',
      cache: false,
      success: function(data) {
        var components = data.results[data.results.length-1];

        return callback(null, components);
      },
      error: function(xhr, status, err) {
        return callback(err.toString(), null);
      }
    });
  },
  addAnswer: function (callback) {
    $.ajax({
      url: "/api/addAnswer",
      type: "POST",
      dataType: 'json',
      data: this.state.gatheredData,
      cache: false,
      success: function (data) {
        return callback(null, data);
      },
      error: function (xhr, status, err) {
        return callback(err.toString(), null);
      }
    });
  },
  drawLines: function (){
    const that = this;
    this.drawLine(this.state.gatheredData);

    $.ajax({
      url: "/api/getAnswers",
      type: "GET",
      dataType: 'json',
      cache: false,
      success: function (data) {
        for (var i = 0; i < data.length; i++) {
          that.drawLine(data[i]);
        }
      },
      error: function (xhr, status, err) {
      }
    });

  },
  drawLine (answer) {
    var point1 = L.latLng(answer.currentCountryLat, answer.currentCountryLong);
    var point2 = L.latLng(answer.selectedCountryLat, answer.selectedCountryLong);
    var line_points = [point1, point2];

    var polyline_options = {
        color: '#000',
        weight: 2,
        opacity: .2
    }
    var polyline = L.polyline(line_points, polyline_options).addTo(this.map);
  },
  render: function() {
    return (
      <div className='map'></div>
    );
  }
});
