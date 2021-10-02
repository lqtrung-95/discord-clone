import socketIOClient from "socket.io-client";

export default function getSocket() {
  return socketIOClient(`/ws`, {
    transports: ["websocket"],
    upgrade: false
  });
}
