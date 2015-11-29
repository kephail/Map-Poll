const Graph = React.createClass({

  getInitialState: function () {
    return {
      data: [],
      loaded: false,
      error: ''
    }
  },

  componentDidUpdate: function () {
    this.makeBar();
    this.makeGraph();
  },

  componentWillMount: function () {
    const that = this;
    let { data } = this.state;

    this.setState({ loading: true });

    $.ajax({
      url: "/api/getAnswers",
      type: "GET",
      dataType: 'json',
      cache: false,
      success: function (answers) {

        for (var i = 0; i < answers.length; i++) {
          const answer = answers[i];

          if (i === 0) {
            data.push({
              countryName: answer.selectedCountry,
              count: 1
            });
          }

          for (var j = 0; j < data.length; j++) {

            if (data[j].countryName === answer.selectedCountry && i != 0) {
              data[j].count++;
              break;
            }
            else if (j === data.length - 1 && data[j].countryName != answer.selectedCountry) {
              data.push({
                countryName: answer.selectedCountry,
                count: 1
              });
              break;
            }

          }

          if (i === answers.length - 1) {
            that.setState({
              loaded: true,
              data
            });
          }

        }

      },
      error: function (xhr, status, err) {

        that.setState({
          loading: true,
          error: err
        });

      }
    });

  },
  makeGraph: function () {

    const { data } = this.state;

    var canvasWidth = 300, //width
        canvasHeight = 300,   //height
        outerRadius = Math.min(canvasWidth, canvasHeight) / 2,   //radius
        color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


    var vis = d3.select(".graph")
      .append("svg:svg") //create the SVG element inside the <body>
        .data([data]) //associate our data with the document
        .attr("width", canvasWidth) //set the width of the canvas
        .attr("height", canvasHeight) //set the height of the canvas
        .append("svg:g") //make a group to hold our pie chart
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")") // relocate center of pie to 'outerRadius,outerRadius'

    // This will create <path> elements for us using arc data...
    var arc = d3.svg.arc()
      .outerRadius(outerRadius-40);

    var pie = d3.layout.pie() //this will create arc data for us given a list of values
      .value(function(d) { return d.count; }) // Binding each value to the pie
      .sort( function(d) { return null; } );

    // Select all <g> elements with class slice (there aren't any yet)
    var arcs = vis.selectAll("g.slice")
      // Associate the generated pie data (an array of arcs, each having startAngle,
      // endAngle and value properties)
      .data(pie)
      // This will create <g> elements for every "extra" data element that should be associated
      // with a selection. The result is creating a <g> for every object in the data array
      .enter()
      // Create a group to hold each slice (we will have a <path> and a <text>
      // element associated with each slice)
      .append("svg:g")
      .attr("class", "slice");    //allow us to style things in the slices (like text)

    arcs.append("svg:path")
      //set the color for each slice to be chosen from the color function defined above
      .attr("fill", function(d, i) { return color(i); } )
      //this creates the actual SVG path using the associated data (pie) with the arc drawing function
      .attr("d", arc);

    // Add a countryName to each arc slice...
    arcs.append("svg:text")
      .attr("transform", function(d) { //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        d.outerRadius = outerRadius + 50; // Set Outer Coordinate
        d.innerRadius = outerRadius + 45; // Set Inner Coordinate
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle") //center the text on it's origin
      .style("fill", "Purple")
      .style("font", "bold 12px Arial")
      .text(function(d, i) { return data[i].countryName; }); //get the label from our original data array

    // Add a count value to the larger arcs, translated to the arc centroid and rotated.
    arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
      .attr("transform", function(d) { //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        d.outerRadius = outerRadius; // Set Outer Coordinate
        d.innerRadius = outerRadius/2; // Set Inner Coordinate
        return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
      })
      .style("fill", "White")
      .style("font", "bold 12px Arial")
      .text(function(d) { return d.data.count; });

    // Computes the angle of an arc, converting from radians to degrees.
    function angle(d) {
      var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
      return a > 90 ? a - 180 : a;
    }

  },

  makeBar: function () {
    const { data } = this.state;
    let dataTotal = 0;
    const minCount = 3
    for (let i in data) {
      if (data[i].count >= minCount) {
        dataTotal += data[i].count;
      }
    }

    let color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


    var vis = d3.select(".graph")
      .selectAll("div")
        .data(data.filter(function(d) { return d.count >= minCount  }))
      .enter().append("div")
        .style("width", function(d) { return (d.count / dataTotal) * 100 + "%"; })
        .style("height", "50px")
        .style("background-color", function(d, i) { return color(i); })
        .text(function(d) { return d.countryName + ": " + d.count });
  },

  render: function() {

    const { error, loading, loaded } = this.state;

    return (
    <div>

      {error && (
        <p className="error-message">{error}</p>
      )}

      {loaded ? (
        <div className='graph'></div>
      ) : (
        <p>Loading...</p>
      )}

    </div>
    );
  }
});
