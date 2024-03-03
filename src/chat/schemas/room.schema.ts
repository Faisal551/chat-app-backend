import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Room extends Document {
  @Prop()
  roomName: string;

  @Prop()
  private: boolean;

  @Prop()
  users: string[]

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);