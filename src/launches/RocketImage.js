import React from 'react';

const RocketImage = ({imageURL, imageSizes}) => {
  var regex = /_(\d+)/g
  var newImageURL = imageURL.replace(regex, `_${imageSizes[0]}` )

  return (<img alt="Rocket" src={newImageURL} />)
}

export default RocketImage