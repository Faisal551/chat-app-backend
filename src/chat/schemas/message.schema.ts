import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop()
  content: string;

  @Prop()
  username: string;

  @Prop()
  room: string;

  @Prop()
  type: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);