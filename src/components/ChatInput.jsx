import React, {
  Component
} from 'react';

export default class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: props.socket,
      message: '',
      myId: props.myId,
      myName: props.myName,
      isPrivate: props.isPrivate,
      sendFriendId: props.sendFriendId,
      currentId: props.currentId
    };
  }

  // 监控input变化
  handleChange(e) {
    this.setState({
      message: e.target.value
    });
  }

  // 点击提交或按回车

  handleClick(e) {
    e.preventDefault();
    this.sendMessage();
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.sendMessage();
    }
    return false;
  }

  // 发送聊天信息
  sendMessage() {
    console.log(this.state.isPrivate,'isPrivate')
    console.log(this.state.message,'message')
    const message = this.state.message;
    const socket = this.state.socket;
    console.log(socket,'socket')
    console.log(this.state.currentId,'currentId currentId')
    if (message) {
      const objPrivate = {
        currentId: this.state.currentId,
        sendFriendId: this.state.sendFriendId,
        username: this.state.myName,
        message: message,
        type: 'user'
      };
      const obj = {
        uid: this.state.myId,
        username: this.state.myName,
        message: message,
        type: 'group'
      };
      if (this.state.isPrivate) {
        console.log('是特茹吗')
        // socket.to(objPrivate.sendFriendId).emit('ceshi',obj)
        socket.emit('private', objPrivate);
      } else {
        socket.emit('message', obj);
      }
      this.setState({
        message: ''
      });
    }
    return false;
  }
  render() {
    return (
      <div className="bottom-area">
        <div className="input-box">
          <div className="input">
            <input type="text" maxLength={140} placeholder="按回车提交" value={this.state.message} onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleChange.bind(this)} />
          </div>
          <div className="button">
            <button type="button" onClick={this.handleClick.bind(this)}>
              提交
            </button>
          </div>
        </div>
      </div>
    );
  }

}