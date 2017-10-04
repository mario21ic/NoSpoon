// import Firebase from '../socket/Firebase';
import WS from '../socket/ws';

const SET_PLAYER = 'theMatrix/players/SET_PLAYER';
const REMOVE_PLAYERS = 'theMatrix/players/REMOVE_PLAYERS';
const CLEAR = 'theMatrix/players/CLEAR';

export const viewStates = ['init', 'loading', 'error', 'success'].reduce((obj, val) => ({ ...obj, [val]: val }), {});

const defaultState = {
  players: {},
  status: viewStates.init,
};

export default function reducer(state = defaultState, { type, payload }) {
  switch (type) {
  case SET_PLAYER:
    return {
      ...state,
      players: {
        ...state.players,
        [payload.id]: {
          position: payload.position,
          rotation: payload.rotation,
        }
      }
    };
  case REMOVE_PLAYERS:
    return { ...state, balls: { ...state.balls } };
  case CLEAR:
    return defaultState;
  default:
    return state;
  }
}

// export const connectPlayers = () => ({ type: CONNECT_PLAYERS });
export const setNewPlayer = payload => ({ type: SET_PLAYER, payload });

export const connectPlayers = () => (dispatch) => {
  WS.subscribe('userPosition', (data) => {
    dispatch(setNewPlayer({
      id: data.user.id,
      position: data.position,
      rotation: data.rotation,
    }));
  });
};
  // Firebase.database().ref('/users').on('value', (snapshot) => {
  //   const users = snapshot.val();
  //   dispatch(setNewPlayers(users));
  // })

export const clear = () => ({ type: CLEAR });
