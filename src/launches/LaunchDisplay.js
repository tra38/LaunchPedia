import React from 'react';
import { Accordion } from '../dependencies/react-bootstrap-dependencies';
import LaunchDiv from "./LaunchDiv"

const LaunchDisplay = ({launches, favoritesStore, triggerReload}) => {
  return (
    <Accordion>
      {launches.map(
        (launchDetails) =>
          launchDivConstructor(launchDetails, favoritesStore, triggerReload)
        )
      }
    </Accordion>
  );
}

const launchDivConstructor = (launchDetails, favoritesStore, triggerReload) => {
  return (
    LaunchDiv({
      launchDetails: launchDetails,
      favoritesStore: favoritesStore,
      triggerReload: triggerReload
    })
  );
}

export default LaunchDisplay;