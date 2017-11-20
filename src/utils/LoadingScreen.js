import React from 'react';
import logo from './logo.svg';

const LoadingScreen = () => {
  return (
      <div>
        <img src={logo} className="App-logo" alt="logo" />
        { "Loading" }
      </div>
    )
}

export default LoadingScreen;