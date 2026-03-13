import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(userData: any): Promise<UserDocument> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const createdUser = new this.userModel({
            ...userData,
            password: hashedPassword,
        });
        return createdUser.save();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async setResetToken(userId: any, token: string, expiry: Date): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, {
            resetToken: token,
            resetTokenExpiry: expiry,
        }).exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().select('-password').exec();
    }

    async findByResetToken(token: string): Promise<UserDocument | null> {
        return this.userModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() },
        }).exec();
    }

    async updatePassword(userId: any, passwordHash: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, {
            password: passwordHash,
            $unset: { resetToken: 1, resetTokenExpiry: 1 },
        }).exec();
    }
}
