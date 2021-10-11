import React, { useContext, useState } from 'react';
import PrivateMessages from './PrivateMessage';
import Messages from './Messages';
import ChatInput from './ChatInput';
import SideChat from './SideChat';
import { Context } from '../context';

// 生成消息id
const generateMsgId = () => {
  return String(new Date().getTime()) + Math.floor(Math.random() * 899 + 100);
};

// 时间格式
const generateTime = () => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const hourText = hour === 0 ? '00' : String(hour);
  const minuteText = minute < 10 ? '0' + minute : String(minute);
  return hourText + ':' + minuteText;
};

const ChatRoom = (props) => {
  const { state, dispatch } = useContext(Context);
  const [init, setInit] = useState(false);

  // 获取在线列表
  const onLineList = (o,action) => {
    console.log(o,'什么呀')
    const newMsg = { username: o.user.username};
    dispatch({
      type: 'UPDATE_USER_LIST',
      payload: {
        onlineUsers: o.onlineUsers,
        onlineUsersList: newMsg
      }
    });
  }
  // 更新系统消息
  const updateSysMsg = (o, action) => {
    const newMsg = { type: 'system', username: o.user.username, uid: o.user.uid, action: action, msgId: generateMsgId(), time: generateTime() };
    dispatch({
      type: 'UPDATE_SYSTEM_MESSAGE',
      payload: {
        onlineCount: o.onlineCount,
        onlineUsers: o.onlineUsers,
        message: newMsg
      }
    });
  };

  // 发送新消息
  const updateMsg = (obj) => {
    const newMsg = { type: 'chat', username: obj.username, uid: obj.uid, action: obj.message, msgId: generateMsgId(), time: generateTime() };
    dispatch({
      type: 'UPDATE_USER_MESSAGE',
      payload: {
        message: newMsg,
      }
    });
  };

  // 私聊新消息
  const updatePrivateMsg = (obj) => {
    const newMsg = {username: obj.username, sendFriendId: obj.sendFriendId,currentId: obj.currentId,action: obj.message, msgId: generateMsgId(), time: generateTime()};
    dispatch({
      type: 'UPDATE_PRIVATE_MESSAGE',
      payload: {
        privateMessages: newMsg,
      }
    });
  };
  // 存储信息
  const updateStoreMsg = (obj) => {
    const storeMsg = [];
    console.log(obj,'这是存储的信息')
    storeMsg.push(obj)
    dispatch({
      type: 'UPDATE_STORE_LIST',
      payload: {
        storeMessageList: storeMsg,
      }
    });
  }
    // 私聊当前
  const updateCurrentMsg = (obj) => {
    const newMsg = {username: obj.username, sendFriendId: obj.sendFriendId,currentId: obj.currentId,action: obj.message, msgId: generateMsgId(), time: generateTime() };
    dispatch({
      type: 'UPDATE_CURRENT_MESSAGE',
      payload: {
        currentMessage: newMsg,
      }
    });
  };
  // 监听消息发送
  const ready = () => {
    const { socket } = props;
    setInit(true);
    socket.on('login', (o) => {
      console.log(o,'000000000000000000000')
      onLineList(o)

      updateSysMsg(o, 'login');
      
    });
    socket.on('logout', (o) => {
      updateSysMsg(o, 'logout');
    });
    socket.on('message', (obj) => {
      console.log(obj,'这是群聊')
      updateMsg(obj);
    });
    socket.on('private',(obj) => {
      console.log(obj,'这是收到的消息')
      // socket.to(obj.sendFriendId).emit('receiveMsg', obj)
    })
    socket.on('ceshi',(obj) => {
      console.log(obj,'这是收到的私发的消息')
      updatePrivateMsg(obj)
      updateCurrentMsg(obj)
    })
  };
  if (!init) {
    ready();
  }
  const renderUserList = () => {
    const users = state.onlineUsers;
    console.log(users,'0000')
    let userhtml = [];
    let separator = '';
    for (const key in users) {
      console.log(key,'0000999')
      if (key) {
        // userhtml += separator + users[key];
        // separator = '、';
        userhtml.push(users[key])
      }
    }
    console.log(userhtml,'userhtml')
    return userhtml;
  };
  const ChatRoomDom = () => {
    return (
      <div className="chat-body">
        <div className="room-status">
        ceshi:{state.showType}
          在线人数: {state.onlineCount}, 在线列表: {renderUserList()}
        </div>
        <div>
          <Messages messages={state.messages} myId={props.uid} />
          <ChatInput myId={props.uid} myName={props.username} socket={props.socket} isPrivate={false}/>
        </div>
      </div>
    )
  }
  const PrivateChat = () => {
    return (
      <div className="chat-body">
         <PrivateMessages messages={state.messages} myId={state.showType} />
         <ChatInput myId={props.uid} myName={props.username} socket={props.socket} isPrivate={true} currentId={props.uid} sendFriendId={state.showType}/>
      </div>
    )
  }
 
 let components;
 if (state.showType === 1) {
  components = <ChatRoomDom/>
 } else if (state.showType === 0) {
  components = <ChatRoomDom/>
 } else {
  components = <PrivateChat/>
 }

 const Top = () => {
   if (state.showType == 1) {
     return (
      <div className="room-action">
          <div className="room-name">鱼头的聊天室 | {props.username}{props.uid}</div>
          <div className="button">
            <button onClick={() => window.location.reload()}>登出</button>
          </div>
      </div>
     )
   } else if(state.showType == 0) {
    return (<div className="room-action">welcome</div>)

   } else {
     return (
      <div className="room-action">
            <div className="room-name">{props.username}的私聊窗口|{props.uid}</div>
            <div className="button">
              <button onClick={() => window.location.reload()}>登出</button>
            </div>
      </div>
     )
   }
 }
  return (
    <div className="chat-room">
      <SideChat/>
      <div className="welcome">
        <Top/>
       </div>
       {components}
      </div>
  );
};
export default ChatRoom;
