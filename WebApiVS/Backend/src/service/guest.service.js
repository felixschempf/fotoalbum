import DatabaseFactory from "../database.js";
import { ObjectId } from "mongodb";
/**
 * Fachliche Anwendungslogik für alles rund um Adressdatensätze.
 */
export default class GuestService {
    /**
     * Konstruktor
     */
    constructor() {
        this._guests = DatabaseFactory.database.collection("guest");
    }

    /**
     * Adressen suchen
     */
    async search(query) {
        let cursor = this._guests.find(query, {
            sort: {
                name: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Adresse anlegen
     */
    async create(guest) {
        guest = guest || {};

        let newGuest = {
            name:    guest.name || "",
            text:   guest.text  || "",
        };

        let result = await this._guests.insertOne(newGuest);
        return await this._guests.findOne({_id: result.insertedId});
    }

    /**
     * Einzelne Adresse anhand ihrer ID lesen
     */
    async read(id) {
        let result = await this._guests.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Einzelne Werte einer Adresse überschreiben
     */
    async update(id, guest) {
        let oldGuest = await this._guests.findOne({_id: new ObjectId(id)});
        if (!oldGuest) return;

        let updateDoc = {
            $set: {
                // Felder, die geändert werden sollen
            },
        };

        if (guest.name)      updateDoc.$set.name = guest.name;
        if (guest.text)     updateDoc.$set.text  = guest.text;

        await this._guests.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._guests.findOne({_id: new ObjectId(id)});
    }

    /**
     * Einzelne Adresse löschen
     */
    async delete(id) {
        let result = await this._guests.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
};