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
  privateMessages: [],
  onlineUsers: {},
  onlineCount: 0,
  userhtml: '',
  onlineUsersList: [],
  showType: 0,
  currentUserId: '',
  storeMessageList: [],
  currentMessage: {},
  ceshiPrivate: []
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

const storeMessage = (listItem,state) => {
  console.log(listItem,'.....')
}

const privateMessage = (privateMsg,state) => {
  console.log(privateMsg,'传递privateMsg')
  console.log(state.showType,'????当前点击的对象')
  console.log(state.storeMessageList,'storeMessageListstoreMessageList')
  let ceshi= []
  console.log(privateMsg.privateMessages['currentId'],'privateMsg.privateMessages[d')
  let a = privateMsg.privateMessages['currentId']
  let b = privateMsg.privateMessages['action']
  ceshi.push({
    fromId: a,
    fromMessage: b,
    toId:  privateMsg.privateMessages['sendFriendId'],
    time: +new Date()
  })
  return {
    privateMessages: state.privateMessages.concat(privateMsg.privateMessages),
    ceshiPrivate: state.ceshiPrivate.concat(ceshi)
  };
}
const onlineUserList = (sysMsg, state) => {
  console.log(state.onlineUsersList, '???stateList')
  console.log(sysMsg, '????????????sy')
  let allUser = []
  for (const key in sysMsg.onlineUsers) {
    allUser.push({
      id: key,
      name: sysMsg.onlineUsers[key]
    })
  }
  console.log(allUser,'allUser')
  console.log(state.currentUserId,'这是获取的currenId')
  console.log(allUser.findIndex(item => item.id == state.currentUserId))
  allUser.splice(allUser.findIndex(item => item.id == state.currentUserId),1)
  return {
    onlineUsersList: [{id:1,name:'群聊'},...allUser]
  };
}

const showTypeChange = (type,state) => {
  console.log(type,'obj private')
  return type
}

const updateCurrentUserChane = (id,state) => {
  console.log(id,'currentUserIdcurrentUserIdcurrentUserId')
  return id;
}

const updateCurrentMessage = (current,state) => {
  return current;
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
    case 'SHOW_TYPE':
      return {
        ...state, ...showTypeChange(action.payload, state)
      };
    case 'UPDATE_PRIVATE_MESSAGE':
      return {
        ...state, ...privateMessage(action.payload, state)
    };
    case 'UPDATE_CURRENT_USER':
      return {
        ...state, ...updateCurrentUserChane(action.payload, state)
    };
    case 'UPDATE_STORE_LIST':
      return {
        ...state, ...storeMessage(action.payload, state)
    };
    case 'UPDATE_CURRENT_MESSAGE':
      return {
        ...state, ...updateCurrentMessage(action.payload, state)
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