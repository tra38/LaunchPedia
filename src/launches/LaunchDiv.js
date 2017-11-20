import React from 'react';
import { Panel } from "../dependencies/react-bootstrap-dependencies"
import LaunchInfo from "./LaunchInfo.js"
import LaunchHeader from "./LaunchHeader.js"

const LaunchDiv = ({launchDetails, favoritesStore, triggerReload}) => (
  <Panel
    header={ LaunchHeader({launchDetails}) }
    eventKey={launchDetails.id}
    key={launchDetails.id}
    className="Launch-div">
    <LaunchInfo
      rocketName={launchDetails.rocket.name}
      locationName={launchDetails.location.name}
      agencies={launchDetails.rocket.agencies}
      imageURL={launchDetails.rocket.imageURL}
      imageSizes={launchDetails.rocket.imageSizes}
      favoritesStore={favoritesStore}
      launch={launchDetails}
      triggerReload={triggerReload}/>
  </Panel>
);

export default LaunchDiv