import DatabaseFactory from "../database.js";

/**
 * Fachliche Anwendungslogik für alles rund um Adressdatensätze.
 */
export default class AddressService {
    /**
     * Konstruktor
     */
    constructor() {
        this._addresses = DatabaseFactory.database.collection("address");
    }

    /**
     * Adressen suchen
     */
    async search(query) {
        let cursor = this._addresses.find(query, {
            sort: {
                first_name: 1,
                last_name: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Adresse anlegen
     */
    async create(address) {
        address = address || {};

        let newAddress = {
            first_name: address.first_name || "",
            last_name:  address.last_name  || "",
            email:      address.email      || "",
            phone:      address.phone      || "",
        };

        let result = await this._addresses.insertOne(newAddress);
        return await this._addresses.findOne({_id: result.insertedId});
    }

    /**
     * Einzelne Adresse anhand ihrer ID lesen
     */
    async read(id) {
        let result = await this._addresses.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Einzelne Werte einer Adresse überschreiben
     */
    async update(id, address) {
        let oldAddress = await this.addresses.findeOne({_id: new ObjectId(id)});
        if (!oldAddress) return;

        let updateDoc = {
            $set: {
                // Felder, die geändert werden sollen
            },
        };

        if (address.first_name) updateDoc.$set.first_name = address.first_name;
        if (address.last_name)  updateDoc.$set.last_name  = address.last_name;
        if (address.phone)      updateDoc.$set.phone      = address.phone;
        if (address.email)      updateDoc.$set.email      = address.email;

        await this._addresses.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._addresses.findOne({_id: new ObjectId(id)});
    }

    /**
     * Einzelne Adresse löschen
     */
    async delete(id) {
        let result = await this._addresses.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
};
