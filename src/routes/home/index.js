import { h, Component } from 'preact';
import style from './style';

export default class Home extends Component {
	render() {
		return (
			<a-scene  vr-mode-ui="enabled: true">
				<a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" />
				<a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E" />
				<a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D" />
				<a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4" />
				<a-sky color="#ECECEC" />
				<a-entity vive-controls="hand: left" />
				<a-entity vive-controls="hand: right" />
			</a-scene>
		);
	}
}