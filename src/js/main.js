const App = React.createClass({

  render: function(){
    return(
      <div className="main">
        <nav className="navbar navbar-default">
          <a className="navbar-brand" href="/">Map Poll</a>
          <ul className="nav navbar-nav navbar-right">
            <li><a href="/">More Questions</a></li>
            <li><a href="/">Create Question</a></li>
          </ul>
        </nav>
        <h1>If you had to save a country from being destroyed, who would you save? (excluding your own)</h1>
        <Map />
        <Graph title="Top Selected Countries" type="topContries" />
        <Graph title="Countries who selected your country" type="topContries2" />
        <Graph title="Countries your country selected" type="topContries3" />
      </div>
    )
  }


});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
