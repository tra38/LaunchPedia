import React, { Component } from 'react';
import logo from './logo.svg';
import Panel from 'react-bootstrap/lib/Panel';
import Accordion from 'react-bootstrap/lib/Accordion';
import Media from 'react-bootstrap/lib/Media';
import './App.css';

const launchHeader = ({launchDetails}) => (
  <strong>
    <p>{launchDetails.name}</p>
    <p>Launch Date: {launchDetails.net}</p>
  </strong>
)

const RocketImage = ({imageURL, imageSizes}) => {
  var regex = /_(\d+)/g
  var newImageURL = imageURL.replace(regex, `_${imageSizes[0]}` )

  return (<img src={newImageURL} thumbnail={true} responsive={true} />)
}

class LaunchInfo extends Component {
  constructor() {
    super();
    this.state = { locationName: "",  agencies: [], imageURL: "", imageSizes: [], rocketName: ""};
  }

  launchURL(launchId) {
    var url = `https://launchlibrary.net/1.2/launch/${launchId}`
    return url
  }

  numberOfAgencies(agencies) {
    if (agencies.length > 1) {
      return agencies.length + " agencies:"
    }
    else {
      return ""
    }
  }

  agencyNames(agencies) {
    var array = []
    agencies.forEach((agency) => {
      array.push(agency.name)
    })
    if (array.length > 1) {
      array[array.length - 1] = "and " + array[array.length - 1]
    }
    return array.join(", ")
  }

  componentDidMount() {
    fetch(this.launchURL(this.props.launchId))
      .then(launch =>
        launch.json()
      )
      .then(launch => launch.launches[0])
      .then(data =>
        this.setState(
          {
            rocketName: data.rocket.name,
            locationName: data.location.name,
            agencies: data.rocket.agencies,
            imageURL: data.rocket.imageURL,
            imageSizes: data.rocket.imageSizes
          }
        )
      );
  }

  render() {
    return (
      <Media>
        <Media.Left align="top">
          <RocketImage imageURL={this.state.imageURL} imageSizes = {this.state.imageSizes} />
        </Media.Left>
        <Media.Body>
          {this.state.rocketName} is being prepared for launch at {this.state.locationName}. This rocket is controlled by {this.numberOfAgencies(this.state.agencies)} {this.agencyNames(this.state.agencies)}.
        </Media.Body>
      </Media>
    );
  }

}

const LaunchDiv = ({launchDetails}) => (
  <Panel header={ launchHeader({launchDetails}) } eventKey={launchDetails.id}>
    <LaunchInfo launchId={launchDetails.id} />
  </Panel>
);

class App extends Component {
  constructor() {
    super();
    this.state = { launches: [] };
  }

  componentDidMount() {
    fetch('https://launchlibrary.net/1.2/launch').
      then(result =>
        result.json()
      )
      .then(result => this.setState ({launches: result.launches }));
  }

  renderUsers() {
    return <Accordion>
      {this.state.launches.map(
        (launchDetails) =>
          LaunchDiv({ launchDetails })
      )}
    </Accordion>
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to SUPER-React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p className="App-intro">
          { this.renderUsers() }
        </p>
      </div>
    );
  }
}

export default App;
