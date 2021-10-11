import React, { useContext, useEffect, useRef } from 'react';
import { Context } from '../context';


const Message = (props) => {

    return (
      <div className={props.isMe ? 'me one-message' : 'other one-message'}>
        <p className="time">
          <span>{props.msgUser}</span> {props.time}
        </p>
        <div className="message-content">{props.action}</div>
      </div>
    );
};

const PrivateMessages = (props) => {
  console.log(props.myId,'uiduid')

  const messageList = useRef(null);
  // 使用context中的状态，而不是props传值
  const { state } = useContext(Context);

  // 使用useFffect取代componentDidUpdate
  useEffect(() => {
    window.scrollTo(0, messageList.current.clientHeight + 50);
  });
  const { uid, messages,privateMessages,showType,currentUserId,currentMessage,ceshiPrivate } = state;
  console.log(privateMessages,showType,'privateMessagesprivateMessagesprivateMessages')
  console.log(showType,'showType')
  console.log(currentUserId,'currentUserIdcurrentUserId')
  console.log(ceshiPrivate,'ceshiPrivate')
  console.log(privateMessages.length && privateMessages.filter(item => item.sendFriendId === currentUserId && item.currentId === showType),'end')
  let message = []
 let messageMSG = ceshiPrivate
 console.log(messageMSG.filter(item => item.toId === currentUserId),'dfddddd')
   let first = []
    let second= []
    messageMSG.forEach(item => {
        if (item.toId === currentUserId) {
            first = first.concat(item)
        }
    })
    first.forEach(item2 => {
            if (item2.fromId === showType) {
            second = second.concat(item2)
            }
        })
    console.log(first,'firstfirst')

    console.log(second,'second')
    console.log(ceshiPrivate.filter(item => item.fromId === currentUserId && item.toId === showType),'third')
    second = second.concat(...ceshiPrivate.filter(item => item.fromId === currentUserId && item.toId === showType))
    console.log(second.concat(...ceshiPrivate.filter(item => item.fromId === currentUserId && item.toId === showType)),'fourth')
    const sortFun  = (p) => {
        return function(m,n){
            var a = m[p];
            var b = n[p];
            return a - b; //升序
        }
    }
    console.log(second.sort(sortFun('time')),'排序')
  return (
    <div className="messages" ref={messageList}>
      {second.length && second.map((message,index) => (
        <Message key={index}  msgUser={'ceshi'}  action={message.fromMessage} isMe={currentUserId === message.fromId ? true : false}  />
      ))}
    </div>
  );
};

export default PrivateMessages;