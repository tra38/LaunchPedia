import React, { Component } from 'react';
import { Form, FormGroup, FormControl, InputGroup, DropdownButton, MenuItem } from "../dependencies/react-bootstrap-dependencies";

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
    if ( agencies != null )
    {
      agencies.forEach((agency) => {
        if ( agency == null )
        {
          array.push("");
        }
        else
        {
          array.push(agency.abbrev)
        }
      })
    }
    return array.join(" ")
  }

  launchData = (launch) => {
    if (this.state.searchType === "Country Code") {
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
      if(launchData(launch).indexOf(queryText.toLowerCase()) !== -1)
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

export default SearchInput;