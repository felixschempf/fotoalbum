import DatabaseFactory from "../database.js";
import { ObjectId } from "mongodb";

export default class GuestService {
    
    constructor() {
        this._guests = DatabaseFactory.database.collection("guest");
    }

    
    async search(query) {
        let cursor = this._guests.find(query, {
            sort: {
                name: 1,
            }
        });

        return cursor.toArray();
    }

    
    async create(guest) {
        guest = guest || {};

        let newGuest = {
            name:    guest.name || "",
            text:   guest.text  || "",
        };

        let result = await this._guests.insertOne(newGuest);
        return await this._guests.findOne({_id: result.insertedId});
    }

    
    async read(id) {
        let result = await this._guests.findOne({_id: new ObjectId(id)});
        return result;
    }

    
    async update(id, guest) {
        let oldGuest = await this._guests.findOne({_id: new ObjectId(id)});
        if (!oldGuest) return;

        let updateDoc = {
            $set: {
                
            },
        };

        if (guest.name)      updateDoc.$set.name = guest.name;
        if (guest.text)     updateDoc.$set.text  = guest.text;

        await this._guests.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._guests.findOne({_id: new ObjectId(id)});
    }

        async delete(id) {
        let result = await this._guests.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
};