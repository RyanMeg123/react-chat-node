import React, { useContext, useState,useRef } from 'react';
import { Context } from '../context';

const SideItem = (props) => {
    return (
    <div className="side-list">
        <span>{props.name}</span>
    </div>
    )
}
const SideChat = (props) => {
  const sideList = useRef(null);
  console.log(sideList,'sideList')
     // 使用context中的状态，而不是props传值
  const { state } = useContext(Context);
  const { uid, onlineUsers,onlineUsersList} = state;
  console.log(onlineUsers,'空的吗')
  console.log(onlineUsersList,'成功了吗')
  return (
    <div className="side-container" ref={sideList}>
    {
        onlineUsersList.length && onlineUsersList.map((i,index) => {
          return ( <SideItem name={i} key={index}/>)
        })
    }

    </div>
  )
}
export default SideChat;
