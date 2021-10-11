import React, { useContext, useState,useRef,useEffect } from 'react';
import { Context } from '../context';
import avatar1 from '../img/avatar1.jpg'
import groupIcon from '../img/group-icon.png'


const SideChat = (props) => {
  const sideList = useRef(null);
     // 使用context中的状态，而不是props传值
  const { state,dispatch } = useContext(Context);
  const { uid, onlineUsers,onlineUsersList,currentUserId} = state;
  console.log(onlineUsersList,'onlineUsersList')
  console.log(currentUserId,'currentUserId')
//   const updateUserList = JSON.parse(JSON.stringify(onlineUsersList))
//   updateUserList.splice(updateUserList.findIndex(item => item.id === currentUserId),1)
//   console.log(updateUserList,'updateUserList')
  const SideItem = (props) => {
    const ceshi = (e) => {
        console.log(e, props.uid,'ceshichange')
        dispatch({
            type: 'SHOW_TYPE',
            payload: {
                showType: props.uid
            }
        });
        console.log(state.showType,'showType')
    }

    return (
    <div className={state.showType === props.uid ? "active side-list" : "side-list"} onClick={ceshi}>
     {props.uid === 1 ? <img src={groupIcon} className="avatar-img"/> : <img src={avatar1} className="avatar-img"/>}
        <span className="list-name">{props.name}</span>
        <span className="list-name">{props.show}</span>
    </div>
    )
  }
  return (
    <div className="side-container" ref={sideList}>
    {
        onlineUsersList.length && onlineUsersList.map((i,index) => {
          return ( <SideItem name={i.name} key={index} uid={i.id}/>)
        })
    }

    </div>
  )
}
export default SideChat;
