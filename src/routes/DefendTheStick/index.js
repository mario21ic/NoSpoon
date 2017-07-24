import 'aframe';
import 'super-hands';
import { h, Component } from 'preact';
import loadComponents from './components';
import CANNON from 'cannon';
import physics from 'aframe-physics-system';
import DefenderPlayer from './components/playerDefender';
import CellphonePlayer from './components/playerAttacker';
import OtherAttackers from './components/otherAttackers';
import { getDisplay } from './components/helpers';
import './socket';
physics.registerAll();

export default class Profile extends Component {

  componentWillMount() {
    loadComponents();
    this.prepareGame();
  }

  prepareGame = () => {
    getDisplay()
      .then(isHeadSet => {
        this.setState({
          lives: 3,
          timeStart: Date.now(),
          isHeadSet,
          isDefender: (this.props.defender === 'true'),
          loser: false,
          userID: `user-${performance.now().toString().split('.').join('')}`,
          isReady: true,
        });
      })
  };

  removeLife = () => {
    this.setState(
      ({ lives }) => ({
        lives: lives - 1
      }),
      this.gameLoop
    );
  };

  gameLoop = () => {
    const { lives, timeStart } = this.state;
    const loser = lives < 0;
    const timePlaying = Date.now();
    const timeSession = loser ? timeStart - timePlaying : 0;
    this.setState({
      loser,
      timeSession
    });
  };
  componentDidMount() {
    setTimeout(() => {
      this.box.body.applyImpulse(
        new CANNON.Vec3(10, 10, 2) /* impulse */,
        new CANNON.Vec3().copy(
          this.box.getAttribute('position')
        ) /* world position */
      );
    }, 10000);
  }

  getPlayer = () => {
    const { lives, loser, isDefender, userID } = this.state;
    if (isDefender) {
      return (
        <DefenderPlayer
          removeLife={this.removeLife}
          lives={lives}
          loser={loser}
          userID={userID}
        />
      );
    }
    return (
      <CellphonePlayer
        lives={lives}
        winner={!loser}
        userID={userID}
      />
    );
  };

  render() {
    // const debug = process.env.NODE_ENV === 'development' ? 'debug: true' : '';
    const { isReady, userID } = this.state;
    if (!isReady) {
      return null;
    }
    const player = this.getPlayer();
    const otherAttackers = <OtherAttackers userID={userID} />
    return (
      <a-scene physics="friction: 0.2; restitution: 1; gravity: -0.5; debug: true;">
        <a-assets>
          <img
            id="skyTexture"
            src="https://cdn.aframe.io/a-painter/images/sky.jpg"
          />
          <img
            id="groundTexture"
            src="https://cdn.aframe.io/a-painter/images/floor.jpg"
          />
          <a-mixin
            id="controller"
            super-hands
            sphere-collider="objects: .cube, .transformer .bullet"
            static-body="shape: sphere; sphereRadius: 0.02;"
          />
          <a-mixin
            id="cube"
            geometry="primitive: box; width: 0.33; height: 0.33; depth: 0.33"
            hoverable
            grabbable
            drag-droppable
            dynamic-body
          />
          <a-mixin
            id="bullet"
            geometry="primitive: sphere; radius: 0.2"
            grabbable
            dynamic-body
          />
        </a-assets>
        <a-entity
          id="sun"
          light="angle:45;decay: 0.5; color:#F0F0F0;type:directional"
          position="0 5.417 0"
          rotation="-81.64648580614231 0 0"
        />

        <a-entity
          id="floor"
          light="angle:45;decay: 0.5; color:#F0F0F0;type:ambient"
          position="0 1 0"
          rotation="0 0 0"
        />
        <a-cylinder
          static-body
          shadow="cast:true;receive:true;"
          id="ground"
          src="https://cdn.aframe.io/a-painter/images/floor.jpg"
          radius="32"
          height="0.1"
        />
        <a-cylinder
          shadow="cast:true;receive:true;"
          static-body
          id="playArea"
          radius="9"
          material="color: rgb(123,123,123); opacity: 0.5;"
          height="0.3"
        />

        <a-sphere
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

        <a-sky
          id="background"
          src="#skyTexture"
          theta-length="90"
          radius="30"
        />
        { player }
        { otherAttackers }
      </a-scene>
    );
  }
}