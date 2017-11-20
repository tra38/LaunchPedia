import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App/App";
import registerServiceWorker from './registerServiceWorker';
import { FavoritesStore } from './stores/all'

// css files
import './css/index.css';
import './css/App.css';
import 'react-dates/lib/css/_datepicker.css';

const launchFavorites = new FavoritesStore()

ReactDOM.render(<App favoritesStore={launchFavorites}/>, document.getElementById('root'));
registerServiceWorker();
