import React, { Component } from 'react';
import logo from './logo.svg';
import Panel from 'react-bootstrap/lib/Panel';
import Accordion from 'react-bootstrap/lib/Accordion';
import Media from 'react-bootstrap/lib/Media';
import Pager from 'react-bootstrap/lib/Pager';
import './App.css';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

const LaunchHeader = ({launchDetails}) => (
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

const LaunchTemplate = ({rocketName, locationName, numberOfAgencies, agencyNames}) => {
  return (
      <p>{rocketName} is being prepared for launch at {locationName}. This rocket is controlled by {numberOfAgencies} {agencyNames}.</p>
  );
}

class LaunchInfo extends Component {
  constructor() {
    super();
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

  render() {
    return (
      <Media className="Launch-info">
        <Media.Left align="top">
          <RocketImage imageURL={this.props.imageURL} imageSizes = {this.props.imageSizes} />
        </Media.Left>
        <Media.Body>
          <LaunchTemplate
            rocketName = {this.props.rocketName}
            locationName = {this.props.locationName}
            numberOfAgencies = {this.numberOfAgencies(this.props.agencies)}
            agencyNames = {this.agencyNames(this.props.agencies)} />
        </Media.Body>
      </Media>
    );
  }

}

const LaunchDiv = ({launchDetails}) => (
  <Panel
    header={ LaunchHeader({launchDetails}) }
    eventKey={launchDetails.id}
    className="Launch-div">
    <LaunchInfo
      rocketName={launchDetails.rocket.name}
      locationName={launchDetails.location.name}
      agencies={launchDetails.rocket.agencies}
      imageURL={launchDetails.rocket.imageURL}
      imageSizes={launchDetails.rocket.imageSizes} />
  </Panel>
);

class LaunchDatePicker extends Component {
  constructor() {
    super();
    this.state = { startDate: null, endDate: null, focusedInput: null }
  }

  updateDates = (startDate, endDate) => {
    this.setState({ startDate: startDate, endDate: endDate });
    this.props.updateParentDate({ startDate: startDate, endDate: endDate });
  }

  render() {
    return (
      <div className="Launch-date-picker">
        <DateRangePicker
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onDatesChange={({ startDate, endDate }) => this.updateDates(startDate, endDate) }
          focusedInput={this.state.focusedInput}
          onFocusChange={focusedInput => this.setState({ focusedInput })}
          showClearDates={true}

          //Necessary to allow users to pick dates earlier than today:
          //https://github.com/airbnb/react-dates/issues/239#issuecomment-302574295
          isOutsideRange={() => false } />
      </div>
    );
  }

}

const LaunchDisplay = ({launches}) => {
  return (
    <Accordion>
        {launches.map(
          (launchDetails) =>
            LaunchDiv({ launchDetails })
        )}
    </Accordion>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = { launches: [], startDate: null, endDate: null, offset: 0, total: 0, count: 0 };
  }

  componentDidMount() {
    this.queryData();
  }

  fullLaunchURLTemplate(formattedStartDate, formattedEndDate, offset) {
    return `https://launchlibrary.net/1.3/launch/${formattedStartDate}/${formattedEndDate}?offset=${offset}`
  }

  launchesURL() {
    var startDate = this.state.startDate
    var endDate = this.state.endDate
    var offset = this.state.offset
    if (startDate == null && endDate == null) {
      return this.fullLaunchURLTemplate("2017-11-19", "2017-12-01", offset)
    } else if (endDate == null) {
      var formattedStartDate = startDate.format('YYYY-MM-DD')
      return `https://launchlibrary.net/1.3/launch/${formattedStartDate}?offset={offset}`
    } else {
      var formattedStartDate = startDate.format('YYYY-MM-DD')
      var formattedEndDate = endDate.format('YYYY-MM-DD')
      return this.fullLaunchURLTemplate(formattedStartDate, formattedEndDate, offset)
    }
  }

  queryData() {
    var url = this.launchesURL()
    console.log(url)
    fetch(url).
      then(result =>
        result.json()
      )
      .then(result => this.setState ({launches: result.launches, offset: result.offset, total: result.total, count: result.count }));
  }

  updateParentDate = (object) => {
    var startDate = object.startDate
    var endDate = object.endDate
    this.setState({ startDate: startDate, endDate: endDate, offset: 0 });
    this.queryData();
  }

  goBackwards = () => {
    var previousOffset = this.state.offset;
    this.setState(
      { offset: previousOffset - 10 },
      this.queryData
    )
  }

  goForward = () => {
    var previousOffset = this.state.offset;
    this.setState(
      { offset: previousOffset + 10 },
      this.queryData
    )
  }

  checkIfNextIsDisabled() {
    var launchesViewed = this.state.count + this.state.offset
    return launchesViewed === this.state.total
  }

  checkIfPrevIsDisabled() {
    return this.state.offset === 0
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
        <Panel>
          <LaunchDatePicker updateParentDate={this.updateParentDate}/>
        </Panel>
        <p className="App-intro">
          <Pager>
            <Pager.Item previous disabled={this.checkIfPrevIsDisabled()} onSelect={ this.goBackwards }>&larr; Previous Page</Pager.Item>
            <Pager.Item next disabled={this.checkIfNextIsDisabled()} onSelect={ this.goForward }>Next Page &rarr;</Pager.Item>
          </Pager>
          <LaunchDisplay launches={this.state.launches} />
        </p>
      </div>
    );
  }
}

export default App;
