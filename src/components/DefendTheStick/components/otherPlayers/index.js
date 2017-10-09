import 'aframe';
import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import { connect } from 'react-redux';
import Face from '../face';

class OtherPlayers extends Component {
  constructor(props) {
    super(props);
    this.getAttackersComponents = this.getAttackersComponents.bind(this);
  }

  getAttackersComponents() {
    const array = [];
    const { players } = this.props;
    Object.keys(players).forEach((player) => {
      const { rotation, position, id } = players[player];
      array.push(
        <Face
          id={ id }
          key={ id }
          name={ id }
          position={ position }
          rotation={ rotation }
        />
      );
    });
    return array;
  }

  render() {
    const attackerComponents = this.getAttackersComponents();
    return (
      <a-entity>
        { attackerComponents }
      </a-entity>
    );
  }
}

OtherPlayers.propTypes = {
  players: PropTypes.object.isRequired,
};

const mapDispatchToProps = () => ({});
const mapStateToProps = ({ players }) => ({
  players: players.players,
});

export default connect(mapStateToProps, mapDispatchToProps)(OtherPlayers);
