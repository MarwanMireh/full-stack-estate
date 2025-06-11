import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId });
    console.log("✅ New user added:", userId);
    console.log("👥 Current online users:", onlineUser);
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
  console.log("❌ User disconnected. Remaining online users:", onlineUser);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);

    if (receiver && receiver.socketId) {
      io.to(receiver.socketId).emit("getMessage", data);
    } else {
      console.warn("❌ Receiver not online or not found:", receiverId);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(4000);
console.log("✅ Socket.IO server is running on port 4000");
