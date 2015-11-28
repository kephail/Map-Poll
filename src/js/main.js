const App = React.createClass({

  render: function(){
    return(
      <div>
        <Map />
        <Graph />
      </div>
    )
  }


});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
