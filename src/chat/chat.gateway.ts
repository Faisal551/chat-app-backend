import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
const groupOnlineUsers = {};


@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) { }

  afterInit(server: Server) {
    console.log('Socket server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {

    console.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, data: { username: string; room: string }) {
    const { username, room } = data;
    let content = `${username} joined the room`

    let type = "notification"
    let message = await this.chatService.createMessage(username, content, room, type);
    await client.join(room)
    await this.server
      .to(room)
      .emit('joinRoomMessage', message);

    if (!groupOnlineUsers[room]) {
      groupOnlineUsers[room] = {};
    }

    groupOnlineUsers[room][username] = true;


    // Broadcast the updated group-specific online users list to all clients in the group
    this.server.to(room).emit('updateGroupOnlineUsers', Object.keys(groupOnlineUsers[room]));


  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, data: { username: string; room: string }) {
    const { username, room } = data;
    let content = `${username} leave the room`
    let type = "notification"
    await this.chatService.createMessage(username, content, room, type);

    client.leave(room);
    client
      .to(room)
      .emit('leaveRoomMessage', { content, username: username, type, room });


    if (room && groupOnlineUsers[room] && groupOnlineUsers[room][username]) {
      delete groupOnlineUsers[room][username];

      this.server.to(room).emit('updateGroupOnlineUsers', Object.keys(groupOnlineUsers[room]));
    }
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, data: { username: string; room: string; content: string }) {
    const { username, room, content } = data;
    let type = "chat"
    await this.chatService.createMessage(username, content, room, type);
    this.server.to(room).emit('message', { content, username: username, type, room });
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, data: { username: string; room: string; isTyping: boolean }) {
    const { username, room, isTyping } = data;
    client.to(room).emit('typingMsg', { username, isTyping });
  }
}