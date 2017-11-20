import {extendObservable } from 'mobx';

class FavoritesStore {
  constructor() {
    extendObservable(
      this,
      {
      favorites: []
      }
    );
  }

  findIndex(id) {
    return this.favorites.findIndex(launch => launch.id === id);
  }

  hasFavorite(launch) {
    var index = this.findIndex(launch.id);
    return (index > -1);
  }

  toggleFavorite(launch) {
    var alreadyFavorited = this.hasFavorite(launch)
    if (alreadyFavorited) {
      this.removeFavorite(launch)
    } else {
      this.addFavorite(launch)
    }
  }

  addFavorite(launch) {
    this.favorites.push(launch);
  }

  removeFavorite(launch) {
    var index = this.findIndex(launch.id);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
  }
}

export default FavoritesStore;