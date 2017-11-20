import React, { Component } from 'react';
import { Button, Glyphicon } from "../dependencies/react-bootstrap-dependencies"

class FavoriteButton extends Component {
  favoritesMessage() {
    var launch = this.props.launch;
    var isFavorite = this.props.favoritesStore.hasFavorite(launch);
    return isFavorite ? "Remove from Favorites" : "Add to Favorites";
  }

  toggleFavorite = () => {
    var launch = this.props.launch
    this.props.favoritesStore.toggleFavorite(launch)
    this.props.triggerReload();
  }

  render() {
    return (
      <Button onClick = {this.toggleFavorite} >
        <Glyphicon glyph="star" />
        {" "}
        {this.favoritesMessage()}
      </Button>
    );
  }
};

export default FavoriteButton;