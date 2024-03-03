import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Message, MessageSchema } from './schemas/message.schema';
import { Room, RoomSchema } from './schemas/room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }, { name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})

export class ChatModule implements OnModuleInit {
  constructor(private readonly ChatService: ChatService) {}

  async onModuleInit() {
    await this.ChatService.seedDummyData();
  }
}
