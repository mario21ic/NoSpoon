import { omit, debounce } from 'lodash';
import WS from '../socket/ws';
import { getDisplay } from '../../components/DefendTheStick/components/helpers';
import { removeBall } from './bullets';

const CREATE_CURRENT_PLAYER = 'theMatrix/currentPlayer/CREATE_CURRENT_PLAYER';
const ADD_POINT = 'theMatrix/currentPlayer/ADD_POINT';
const READY = 'theMatrix/currentPlayer/READY';
const CLEAR = 'theMatrix/currentPlayer/CLEAR';

const defaulState = {
  points: 0,
  isDefender: false,
  loser: false,
  userID: null,
  isReady: false,
};

export default function reducer(state = {}, { type, payload }) {
  switch (type) {
  case CREATE_CURRENT_PLAYER:
    return { ...state, ...payload.player, isReady: false };
  case READY:
    return { ...state, isReady: payload.isReady, isHeadSet: payload.isHeadSet };
  case ADD_POINT:
    return { ...state, points: payload.points };
  case CLEAR:
    return defaulState;
  default:
    return state;
  }
}

export const setReady = payload => ({ type: READY, payload });

export const setLives = payload => ({ type: ADD_POINT, payload });

export const userMadeAPoint = ({ bulletId }) => (dispatch, getState) => {
  const userId = getState().balls.balls[bulletId];
  if (userId) {
    debouncedWSUserMadeAPoint({ userId, bulletId, dispatch });
  }
};

const WSUserMadeAPoint = ({ userId, bulletId, dispatch }) => {
  WS.send({
    type: 'userMadeAPoint',
    user: {
      id: userId,
    },
  });
  dispatch(removeBall({ id: bulletId }));
};
const debouncedWSUserMadeAPoint = debounce(
  (...args) => WSUserMadeAPoint(...args),
  1500, // 1 Seconds of immortality because reaons
  { leading: false, trailing: true }
);


export const createCurrentPlayer = () => {
  const defender = new URL(window.location.href).searchParams.get('defender');
  const player = {
    points: 0,
    isDefender: !!(defender === 'true'),
    loser: false,
    userID: `user-${performance.now().toString().split('.').join('')}`,
  };

  WS.send({
    type: 'identifyUser',
    user: {
      id: player.userID,
      isDefender: player.isDefender,
    },
  });

  return { type: CREATE_CURRENT_PLAYER, payload: { player } };
};


export const isPlayerReady = () => (dispatch) => {
  WS.subscribe('identifyUser', () => {
    getDisplay()
      .then((isHeadSet) => {
        dispatch(setReady({ isHeadSet, isReady: true }));
      });
  });

  WS.onOpen(() => {
    dispatch(createCurrentPlayer());
  });

};
