import { AbstractRepository } from "@app/common";
import { UserDocument } from "./models/users.schema";
import { Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class UsersRepository extends AbstractRepository<UserDocument>{
    protected logger = new Logger(UsersRepository.name);

    constructor( @InjectModel(UserDocument.name) usersModel:Model<UserDocument>){
        super(usersModel)
    }

}