import React from 'react';

const LaunchTemplate = ({rocketName, locationName, numberOfAgencies, agencyNames}) => {
  return (
    <div>
      {rocketName} is being prepared for launch at {locationName}. This rocket is controlled by {numberOfAgencies} {agencyNames}.
    </div>
  );
}

export default LaunchTemplate;