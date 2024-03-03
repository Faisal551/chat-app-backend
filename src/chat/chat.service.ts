import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { Room } from './schemas/room.schema';


@Injectable()
export class ChatService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>, @InjectModel(Room.name) private roomModel: Model<Room>) { }

  async createMessage(username: string, content: string, room: string, type: string): Promise<Message> {
    const message = await new this.messageModel({ username, content, room, type });
    await message.save();
    return message;
  }

  async getRoomMessages(room: string): Promise<Message[]> {
    let data = await this.messageModel.find({ room }).sort({ createdAt: -1 }).limit(10).exec();
    return data
  }
  async findAllRoom(): Promise<Room[]> {
    try {
      return await this.roomModel.find().exec();
    } catch (error) {
      throw new Error('Unable to find rooms.');
    }
  }

  async createroom(roomDto: Partial<Room>): Promise<Room> {
    try {
      const createdRoom = new this.roomModel(roomDto);
      return await createdRoom.save();
    } catch (error) {
      throw new Error('Unable to create room.');
    }
  }

  async findRoom(id: string): Promise<Room> {
    try {
      const room = await this.roomModel.findById({ _id: new mongoose.Types.ObjectId(id) }).exec();
      if (!room) {
        throw new NotFoundException('Room not found.');
      }
      return room;
    } catch (error) {
      throw new Error('Unable to find room.');
    }
  }
  async delete(id: string): Promise<Room> {
    try {
      const deletedRoom = await this.roomModel.findByIdAndDelete({ _id: id }).exec();
      if (!deletedRoom) {
        throw new NotFoundException('Room not found.');
      }
      return deletedRoom;
    } catch (error) {
      throw new Error('Unable to delete room.');
    }
  }
  async seedDummyData() {
    // Add your dummy data creation logic here
    const dummyData =[
      {
          "private": false,
          "roomName": "Python Room",

      },
      {
          
          "private": false,
          "roomName": "Node Room",
      },
      {
         
          "private": false,
          "roomName": "React Room",
      },
      {
       
          "private": false,
          "roomName": "Laravel Room",
      },
      {
         
          "private": false,
          "roomName": "Php Room",
      } 
  ]
      let rooms= await this.roomModel.find()
      if(rooms.length==0){
        await this.roomModel.insertMany(dummyData);

      } 
  }

  async addRoomUser(room: string, username: string): Promise<Room | null> {
    const updatedRoom = await this.roomModel.findByIdAndUpdate(
      {_id:new mongoose.Types.ObjectId(room)},
      { $push: { users: username } },
      { new: true } 
    );
    return updatedRoom;
  }

  async removeRoomUser(room: string, username: string): Promise<Room | null> {
    const updatedRoom = await this.roomModel.findByIdAndUpdate(
      {_id:new mongoose.Types.ObjectId(room)},
      { $pull: { users: username } },
      { new: true } 
    );

    return updatedRoom;
  }
}