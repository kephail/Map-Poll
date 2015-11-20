var HelloMessage = React.createClass({
  render: function() {
    return <div>Hello</div>;
  }
});

ReactDOM.render(
  React.createElement(HelloMessage, null),
  document.getElementById('content')
);
