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

  hasFavorite(id) {
    var index = this.favorites.indexOf(id);
    return (index > -1);
  }

  toggleFavorite(id) {
    var alreadyFavorited = this.hasFavorite(id)
    if (alreadyFavorited) {
      this.removeFavorite(id)
    } else {
      this.addFavorite(id)
    }
  }

  addFavorite(id) {
    this.favorites.push(id);
  }

  removeFavorite(id) {
    var index = this.favorites.indexOf(id);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
  }
}

export default FavoritesStore;