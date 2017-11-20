import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import FavoritesStore from './favoritesStore.js'

const launchFavorites = new FavoritesStore()

ReactDOM.render(<App favoritesStore={launchFavorites}/>, document.getElementById('root'));
registerServiceWorker();
