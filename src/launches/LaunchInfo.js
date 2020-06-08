import React, { Component } from 'react';
import { Media, Col } from "../dependencies/react-bootstrap-dependencies"
import { LaunchTemplate, RocketImage, FavoriteButton } from "./all.js"

class LaunchInfo extends Component {
  numberOfAgencies(agencies) {
    console.log(agencies);
    if ( agencies == null )
    {
      return ""
    }
    if (agencies.length > 1) {
      return agencies.length + " agencies:"
    }
    else {
      return ""
    }
  }

  agencyNames(agencies) {
    var array = []
    if ( agencies == null )
    {
      return ""
    }
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
        <Col xs={6} md={4}>
          <Media.Left align="top">
            <RocketImage imageURL={this.props.imageURL} imageSizes = {this.props.imageSizes} />
          </Media.Left>
        </Col>
        <Col xs={12} md={8} >
          <Media.Body>
            <LaunchTemplate
              rocketName = {this.props.rocketName}
              locationName = {this.props.locationName}
              numberOfAgencies = {this.numberOfAgencies(this.props.agencies)}
              agencyNames = {this.agencyNames(this.props.agencies)} />
              <Media.Left align="bottom">
                <FavoriteButton
                  favoritesStore = {this.props.favoritesStore}
                  launch = { this.props.launch}
                  triggerReload = { this.props.triggerReload} />
              </Media.Left>
          </Media.Body>
        </Col>
      </Media>
    );
  }

}

export default LaunchInfo;