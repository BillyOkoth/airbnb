import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Logger, NotFoundException } from "@nestjs/common";

export abstract class AbstractRepository <TDocument extends AbstractDocument> {
    protected readonly abstract logger:Logger;
    constructor(private readonly model:Model<TDocument>){}

    async create(document:Omit<TDocument, '_id'>):Promise<TDocument>{
        const createDocument = this.model.create({
            ...document,
            _id: new Types.ObjectId()
        })
        return (await (await createDocument).save()).toJSON() as unknown as TDocument;
    }

    async findOne( filterQuery:FilterQuery<TDocument> ):Promise<TDocument>{
        //WHEN THE DOCUMENT IS NOT FOUND
        const document = await  this.model.findOne(filterQuery).lean<TDocument>(true);

        if(!document){
            this.logger.warn(`Document not found with filter ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException('Document not found');
        }
        return document;
}

    async findOneAndUpdate(filterQuery:FilterQuery<TDocument> , updateQuery:UpdateQuery<TDocument>):Promise<TDocument>{
        const document = await this.model.findOneAndUpdate(filterQuery,updateQuery,{
            new:true
        }).lean<TDocument>(true);

        if(!document){
            this.logger.warn(`Document not found with filter ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException('Document not found');
        }
        return document;
    }

    async find(filterQuery:FilterQuery<TDocument>):Promise<TDocument[]>{
        return await  this.model.find(filterQuery).lean<TDocument[]>(true);
    }

    async findOneAndDelete(filterQuery:FilterQuery<TDocument>):Promise<TDocument>{
        return await this.model.findOneAndDelete(filterQuery).lean<TDocument>(true)
    }

}