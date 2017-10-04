import 'aframe';
import 'super-hands';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HUD from './HUD';

export default class HeadsetPlayer extends Component {
  render() {
    // const debug = process.env.NODE_ENV === 'development' ? 'debug: true' : '';
    const { lives, loser, userID } = this.props;
    return (
      <a-entity>
        <a-entity id="teleHand" hand-controls="left" mixin="controller" />
        <a-entity id="blockHand" hand-controls="right" mixin="controller" />
        <HUD lives={ lives } loser={ loser } userID={ userID } />
      </a-entity>
    );
  }
}

HeadsetPlayer.defaultProps = {
  lives: 3,
  loser: false,
}

HeadsetPlayer.propTypes = {
  lives: PropTypes.number,
  loser: PropTypes.bool,
  userID: PropTypes.string.isRequired
}