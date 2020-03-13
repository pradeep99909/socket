var express = require("express");
var socket = require("socket.io");
var app = express();
var MongoClient = require("mongodb").MongoClient;

var server = app.listen(4000);

var io = socket(server);
var chats = [];
io.on("connection", (socket) => {
  socket.on("chat", function(data) {
    /*-----Mongo DB Connection-----*/
    MongoClient.connect(
      "mongodb+srv://admin:admin78@cluster0-h9gpw.mongodb.net/test?retryWrites=true&w=majority",
      { useUnifiedTopology: true },
      (err, db) => {
        if (err) {
          throw err;
        }
        var dbo = db.db("stock");
        var myobj = { name: data.name, message: data.message };
        dbo.collection("user").insertOne(myobj, function(err, res) {
          if (err) {
            throw err;
          }
          /* sendin chats to client */
          chats = [...chats, data];
          socket.broadcast.emit("receive", chats); /* emiting chats to client */
          socket.emit("receive", chats);
        });
      }
    );
    /*-----Mongo DB Connection-----*/
  });
  socket.on("typing", function(data) {
    socket.broadcast.emit("receive_typing", data.name);
  });
});
