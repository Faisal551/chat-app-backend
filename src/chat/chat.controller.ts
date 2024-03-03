import { Body, Controller, Delete, Get, Param, Post, Render } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Room } from './schemas/room.schema';
import { Message } from './schemas/message.schema';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }
  @Get()
  @Render('index')
  root() {
    return { title: 'Chat Application' };
  }

  @Get("getMessages/:room")
  async findAllMessages(@Param('room') room: string): Promise<Message[]> {
    return await this.chatService.getRoomMessages(room);
  }

  @Post("room")
  async create(@Body() roomDto: Partial<Room>): Promise<Room> {
    return this.chatService.createroom(roomDto);
  }
  @Get("getAllRooms")
  async findAll(): Promise<Room[]> {
    return this.chatService.findAllRoom();
  }

  @Get('getRoom/:id')
  async findOne(@Param('id') id: string): Promise<Room> {
    return this.chatService.findRoom(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Room> {
    return this.chatService.delete(id);
  }
}