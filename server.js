/* eslint-disable */
var path = require("path");
var express = require("express");
var app = express();
var openBrowsers = require("open-browsers");

// log
const log4js = require("log4js");
log4js.addLayout(
  "json",
  config =>
    function(logEvent) {
      logEvent.data = logEvent.data[0];
      return JSON.stringify(logEvent) + config.separator;
    }
);
const logConf = require("./conf/log.conf");
log4js.configure(logConf);
const logger = log4js.getLogger("chatLog");

// 开发模式热更新
if (process.env.NODE_ENV !== "production") {
  var webpack = require("webpack");
  var config = require("./webpack.config");
  var compiler = webpack(config);
  // use in develope mode
  app.use(
    require("webpack-dev-middleware")(compiler, {
      publicPath: config.output.publicPath
    })
  );
  app.use(require("webpack-hot-middleware")(compiler));

  app.get("/", function(req, res) {
    const filename = path.join(compiler.outputPath, "index.html");
    compiler.outputFileSystem.readFile(filename, function(err, result) {
      res.set("content-type", "text/html");
      res.send(result);
      res.end();
    });
  });
} else {
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "dist/index.html"));
  });
}

var server = require("http").createServer(app);
console.log(server, "server");
var io = require("socket.io")(server, {
  allowEIO3: true // false by default
});
console.log(io, "io");

app.use(express.static(path.join(__dirname, "/")));

// 在线用户
var onlineUsers = {};
// 在线用户人数
var onlineCount = 0;

var socketArr = [];

io.on("connection", function(socket) {
  // 监听客户端的登陆
  console.log(socket, "socketsocketsocketsocketsocketsocketsocketsocket");
  socket.on("login", function(obj) {
    // 用户id设为socketid
    socket.id = obj.uid;
    //  socketArr.push(socket.id)

    console.log(obj, "obj");
    // 如果没有这个用户，那么在线人数+1，将其添加进在线用户
    if (!onlineUsers[obj.uid]) {
      onlineUsers[obj.uid] = obj.username;
      onlineCount++;
    }
    console.log(onlineUsers, "onlineUsers");
    // 向客户端发送登陆事件，同时发送在线用户、在线人数以及登陆用户
    io.emit("login", {
      onlineUsers: onlineUsers,
      onlineCount: onlineCount,
      user: obj
    });
    logger.info({
      socketId: socket.id,
      ip: socket.request.connection.remoteAddress,
      user: obj.username,
      event: "in",
      message: obj.username + "加入了群聊"
    });
    console.log(obj.username + "加入了群聊");
  });

  // 监听客户端的断开连接
  socket.on("disconnect", function() {
    // 如果有这个用户
    if (onlineUsers[socket.id]) {
      var obj = { uid: socket.id, username: onlineUsers[socket.id] };

      // 删掉这个用户，在线人数-1
      delete onlineUsers[socket.id];
      onlineCount--;

      // 向客户端发送登出事件，同时发送在线用户、在线人数以及登出用户
      io.emit("logout", {
        onlineUsers: onlineUsers,
        onlineCount: onlineCount,
        user: obj
      });
      logger.info({
        socketId: socket.id,
        ip: socket.request.connection.remoteAddress,
        user: obj.username,
        event: "out",
        message: obj.username + "退出了群聊"
      });
      console.log(obj.username + "退出了群聊");
    }
  });

  // 监听客户端发送的信息
  socket.on('message', function(obj) {

    io.emit('message', obj);
    logger.info({ socketId: socket.id, ip: socket.request.connection.remoteAddress, user: obj.username, event: 'chat', message: obj.username + '说:' + obj.message });
    console.log(obj.username + '说:' + obj.message);
  });
  // 监听私聊消息
  socket.on("private", function(obj) {
    console.log(obj, "????私聊");
    // let find = socketArr.find(item => item === obj.sendFriendId)
    // console.log(find,'findfindfind')
    socket.join(obj.sendFriendId)
    socket.to(obj.sendFriendId).emit("ceshi", obj);
    // // console.log(socket.id,'socket.id')
    io.emit("private", obj);
    io.emit("ceshi", obj);
  });
  socket.on("ceshi", function(obj) {
    console.log(obj, "监听到了吗");
    io.emit("ceshi", obj);
  });
});

server.listen(3310, function(err) {
  console.log(err, "////");
  console.log(process.env.NODE_ENV, "process.env.NODE_ENV");
  if (process.env.NODE_ENV !== "production") {
    openBrowsers("http://localhost:3310");
  }
  console.log("Listening at *:3310");
});
