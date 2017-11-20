import React, { Component } from 'react';
import logo from './logo.svg';

import Panel from 'react-bootstrap/lib/Panel';
import Accordion from 'react-bootstrap/lib/Accordion';
import Media from 'react-bootstrap/lib/Media';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButton';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import './App.css';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import * as moment from 'moment';

const defaultStartDate = moment()
const defaultEndDate = moment().add(15, 'days')

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
    this.state = {
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      focusedInput: null
    }
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

class SearchInput extends Component {

  constructor() {
      super();
      this.state = { searchType: "Country Code", value: "" }
  }

  updateSearchType = (value) => {
    var newSearchType;
    if (value === "1") {
      newSearchType = "Country Code"
    } else {
      newSearchType = "Agency Abbrevation"
    }

    this.setState( {searchType: newSearchType}, this.refreshSearch)
  }

  refreshSearch = () => {
    this.doSearch(this.state.value, this.launchData)
  }

  agencyAbbrevations = (agencies) => {
    var array = []
    agencies.forEach((agency) => {
      array.push(agency.abbrev)
    })
    return array.join(" ")
  }

  launchData = (launch) => {
    if (this.state.searchType == "Country Code") {
      return launch.location.countryCode.toLowerCase()
    } else {
      return this.agencyAbbrevations(launch.rocket.agencies).toLowerCase()
    }
  }

  handleChange = (queryText, launchData) => {
    this.setState({value: queryText}, this.doSearch(queryText, launchData))
  }

  doSearch = (queryText, launchData) => {
    var searchResults =[];
    this.props.launches.forEach(function(launch){
      if(launchData(launch).indexOf(queryText.toLowerCase())!=-1)
        searchResults.push(launch);
    });
    this.props.updateSearchResults({queryText: queryText, searchResults: searchResults})
  }

  render() {
    return (
      <Form inline>
        <FormGroup className="Launch-search">
          <InputGroup>
            <DropdownButton
              componentClass={InputGroup.Button}
              id="input-dropdown-addon"
              title={this.state.searchType}>
                <MenuItem
                  key="1"
                  onSelect = { () => this.updateSearchType("1") }>
                    Country Code
                </MenuItem>
                <MenuItem
                  key="2"
                  onSelect = { () => this.updateSearchType("2") }>
                    Agency Abbrevation
                </MenuItem>
              </DropdownButton>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder="Search"
              onChange={(event) => this.handleChange(event.target.value, this.launchData)} />
            </InputGroup>
        </FormGroup>
      </Form>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = { launches: [], startDate: defaultStartDate, endDate: defaultEndDate, filtered: false, searchResults: [] };
  }

  componentDidMount() {
    this.queryData();
  }

  fullLaunchURLTemplate(formattedStartDate, formattedEndDate, offset) {
    return `https://launchlibrary.net/1.3/launch/${formattedStartDate}/${formattedEndDate}?offset=${offset}`
  }

  launchesURL(offset) {
    var startDate = this.state.startDate
    var endDate = this.state.endDate
    if (startDate == null && endDate == null) {
      var formattedStartDate = defaultStartDate.format('YYYY-MM-DD')
      var formattedEndDate = defaultEndDate.format('YYYY-MM-DD')
      return this.fullLaunchURLTemplate(formattedStartDate, formattedEndDate, offset)
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
    var array = []
    var offset = 0
    var initialUrl = this.launchesURL(0)

    this.accessData(initialUrl, array)
  }

  accessData(url, arrayOfData) {
    fetch(url)
      .then(result =>
        result.json()
      )
      .then(data =>
        this.processData(data, arrayOfData)
      )
  }

  processData(data, arrayOfData) {
    var newArray = arrayOfData.concat(data.launches)

    var launchesViewed = data.count + data.offset
    var total = data.total

    if (launchesViewed < total) {
      var newOffset = data.offset + 10
      var newUrl = this.launchesURL(newOffset)
      this.accessData(newUrl, newArray)
    } else {
      this.setState({launches : newArray})
    }
  }

  updateParentDate = (object) => {
    var startDate = object.startDate
    var endDate = object.endDate
    this.setState({ startDate: startDate, endDate: endDate });
    this.queryData();
  }

  updateSearchResults = (object) => {
    if (object.queryText === '') {
      this.setState({
        searchResults: object.searchResults,
        filtered: false })
    } else {
      this.setState({
        searchResults: object.searchResults,
        filtered: true })
    }
  }

  launchesToDisplay = () => {
    if (this.state.filtered === true) {
      return (<LaunchDisplay launches={this.state.searchResults} />)
    } else {
      return (<LaunchDisplay launches={this.state.launches} />)
    }
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
          <SearchInput
            launches={this.state.launches}
            updateSearchResults={this.updateSearchResults}/>
        </Panel>
        <p className="App-intro">
          { this.launchesToDisplay() }
        </p>
      </div>
    );
  }
}

export default App;
