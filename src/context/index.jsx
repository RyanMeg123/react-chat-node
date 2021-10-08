import React, {
  createContext,
  useReducer
} from 'react';
import io from 'socket.io-client';

const Context = createContext(null);


const initValue = {
  username: '',
  uid: '',
  socket: io(),
  messages: [],
  onlineUsers: {},
  onlineCount: 0,
  userhtml: '',
  onlineUsersList: []
};

const login = (info) => {
  console.log(info, 'infor')
  return info;
};


const systemMessage = (sysMsg, state) => {
  return {
    messages: state.messages.concat(sysMsg.message),
    onlineUsers: sysMsg.onlineUsers,
    onlineCount: sysMsg.onlineCount
  };
};


const userMessage = (usrMsg, state) => {
  return {
    messages: state.messages.concat(usrMsg.message)
  };
};
const onlineUserList = (sysMsg, state) => {
  console.log(state.onlineUsersList, '???stateList')
  console.log(sysMsg, '????????????sy')
  let ceshi = []
  for (const key in sysMsg.onlineUsers) {
    ceshi.push(sysMsg.onlineUsers[key])
  }
  console.log(ceshi,'ceshi')
  return {
    onlineUsersList: ceshi
  };
}


const reducer = (state, action) => {
  console.log(state, action);
  switch (action.type) {
    case 'login':
      return {
        ...state, ...login(action.payload)
      };
    case 'UPDATE_SYSTEM_MESSAGE':
      return {
        ...state, ...systemMessage(action.payload, state)
      };
    case 'UPDATE_USER_MESSAGE':
      return {
        ...state, ...userMessage(action.payload, state)
      };
    case 'UPDATE_USER_LIST':
      return {
        ...state, ...onlineUserList(action.payload, state)
      };
    default:
      return state;
  }
};

const ContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initValue);
  return <Context.Provider value = {
    {
      state,
      dispatch
    }
  } > {
    props.children
  } < /Context.Provider>;
};

const ContextConsumer = Context.Consumer;

export {
  Context,
  ContextProvider,
  ContextConsumer
};