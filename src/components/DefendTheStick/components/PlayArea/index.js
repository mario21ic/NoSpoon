import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TheStick from '../TheStick';
import { AttackerBullet, DefenderBullet } from '../bullet';

class PlayArea extends Component {

  renderAttackerBullets() {
    const { balls, deleteBullet } = this.props;
    const array = [];
    Object.keys(balls).forEach((ball) => {
      const { position } = balls[ball];
      if (position) {
        array.push(
          <AttackerBullet
            key={ ball }
            name={ ball }
            position={ position }
            deleteBullet={ deleteBullet }
          />
        );
      }
    })
    return array;
  }

  renderDefenderBullets() {
    const { balls, deleteBullet } = this.props;
    const array = [];
    Object.keys(balls).forEach((ball) => {
      const { position } = balls[ball];
      if (position) {
        array.push(
          <DefenderBullet
            key={ ball }
            name={ ball }
            position={ position }
            deleteBullet={ deleteBullet }

          />
        );
      }
    });
    return array;
  }
  render() {
    const { removeLife, isDefender } = this.props;
    const ballsComponent = isDefender ? this.renderAttackerBullets() : this.renderDefenderBullets();
    // const otherPersonsBalls = [];
    return (
      <a-entity>
        <a-entity
          environment="preset: starry; groundColor: #445; grid: cross" // starry, tron, contact
        />
        <a-entity
          id="floor"
          name="floor"
          static-body
          position="0 1 0"
          rotation="0 0 0"
        />
        <a-cylinder
          static-body
          shadow="receive:true;"
          id="ground"
          name="ground"
          src="https://cdn.aframe.io/a-painter/images/floor.jpg"
          radius="32"
          height="0.1"
        />
        <a-cylinder
          shadow="receive:true;"
          light="angle:45;decay: 0.1; color:#F0F0F0;type:ambient"
          static-body
          id="playArea"
          name="playArea"
          radius="9"
          material="color: rgb(123,123,123); opacity: 0.5;"
          height="0.3"
        />
        <TheStick onColission={ removeLife } isDefender={ isDefender } />
        { ballsComponent }
        { /* <a-sphere
          grabbable
          maxGrabbers
          ref={c => {
            this.box = c;
          }}
          dynamic-body
          position="0.5 10 0"
          width="1"
          height="1"
          depth="1"
        />
        <a-sphere
          grabbable
          maxGrabbers
          ref={c => {
            this.box = c;
          }}
          dynamic-body
          position="0.5 30 0"
          width="1"
          height="1"
          depth="1"
        />
        <a-sphere
          grabbable
          maxGrabbers
          ref={c => {
            this.box = c;
          }}
          dynamic-body
          position="0.5 100 0"
          width="1"
          height="1"
          depth="1"
        /> */ }
        { /* <a-sky
          id="background"
          theta-length="90"
          radius="30"
        /> */ }
      </a-entity>
    );
  }
}


PlayArea.propTypes = {
  balls: PropTypes.object.isRequired,
  removeLife: PropTypes.func.isRequired,
  deleteBullet: PropTypes.func.isRequired,
  isDefender: PropTypes.bool.isRequired
}

const mapStateToProps = ({ balls, mainApp }) => ({
  balls: balls.balls,
  userID: mainApp.userID,
  isDefender: mainApp.isDefender,
})

export default connect(mapStateToProps, null)(PlayArea);
