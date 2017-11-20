import React, { Component } from 'react';

import { Tabs, Tab, Panel, Glyphicon } from '../dependencies/react-bootstrap-dependencies';

import { LaunchDisplay } from '../launches/all'
import { SearchPanel} from "../search/all"
import { LoadingScreen } from "../utils/all"
import { defaultStartDate, defaultEndDate } from "../defaults/all"

class App extends Component {
  constructor() {
    super();
    this.state = { launches: [], startDate: defaultStartDate, endDate: defaultEndDate, filtered: false, searchResults: [], favoriteLaunches: [], loading: false };
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
    var formattedStartDate;
    var formattedEndDate;
    if (startDate == null && endDate == null) {
      formattedStartDate = defaultStartDate.format('YYYY-MM-DD')
      formattedEndDate = defaultEndDate.format('YYYY-MM-DD')
      return this.fullLaunchURLTemplate(formattedStartDate, formattedEndDate, offset)
    } else if (endDate == null) {
      formattedStartDate = startDate.format('YYYY-MM-DD')
      return `https://launchlibrary.net/1.3/launch/${formattedStartDate}?offset={offset}`
    } else {
      formattedStartDate = startDate.format('YYYY-MM-DD')
      formattedEndDate = endDate.format('YYYY-MM-DD')
      return this.fullLaunchURLTemplate(formattedStartDate, formattedEndDate, offset)
    }
  }

  queryData() {
    this.setState({loading: true})
    var array = []
    var initialUrl = this.launchesURL(0)

    this.accessData(initialUrl, array)
  }

  accessData(url, arrayOfData) {
    fetch(url)
      .then(result => {
        if (result.ok) {
          return result.json()
        } else {
          console.log(result)
          var errorMessage = `Response Failed. Status Code - ${result.status}. Error Message - ${result.statusText}`

          throw new Error(errorMessage)
        }
      })
      .then(data => {
        this.processData(data, arrayOfData)
      })
      .catch(error => {
        console.log(error)
        this.errorHandler(error, arrayOfData)
      })
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
      this.setState({launches : newArray, loading: false})
    }
  }

  errorHandler(error, arrayOfData) {
    this.setState({launches : arrayOfData, loading: false})
  }

  updateParentDate = (object) => {
    var startDate = object.startDate
    var endDate = object.endDate
    this.setState(
      { startDate: startDate, endDate: endDate },
      this.queryData
    );
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

  launchDisplayConstructor = (launches) => {
    if (launches.length === 0) {
      return (<span>No results.</span>)
    } else {
      return (
        <LaunchDisplay
          launches={launches}
          favoritesStore={this.props.favoritesStore}
          triggerReload={this.triggerReload} />
      )
    }
  }

  searchResultDisplay = () => {
    if (this.state.loading === true) {
      return(<LoadingScreen />)
    }
    else if (this.state.filtered === true) {
      return this.launchDisplayConstructor(this.state.searchResults)
    } else {
      return this.launchDisplayConstructor(this.state.launches)
    }
  }

  favoriteResultDisplay = () => {
    return this.launchDisplayConstructor(this.props.favoritesStore.favorites)
  }

  triggerReload = () => {
    this.forceUpdate()
  }

  render() {
    return (
      <div className="App">
        <Tabs defaultActiveKey={1} id="navbar">
          <Tab eventKey={1} title="Search">
            <SearchPanel
              updateParentDate={this.updateParentDate}
              launches={this.state.launches}
              updateSearchResults={this.updateSearchResults} />
            { this.searchResultDisplay() }
          </Tab>
          <Tab eventKey={2} title="Favorites">
            <Panel>
              Your favorites are stored here. To add or remove a favorite, simply click on the <Glyphicon glyph="star" /> button on the Search page.
            </Panel>

            { this.favoriteResultDisplay() }
          </Tab>
        </Tabs>
      </div>
    );
  }
};

export default App;
