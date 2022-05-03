import DatabaseFactory from "../database.js";

/**
 * Fachliche Anwendungslogik für alles rund um Adressdatensätze.
 */
export default class SpeiseService {
    /**
     * Konstruktor
     */
    constructor() {
        this._speisen = DatabaseFactory.database.collection("speise");
    }

    /**
     * Adressen suchen
     */
    async search(query) {
        let cursor = this._speisen.find(query, {
            sort: {
                name_gericht: 1,
                gericht_nummer: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Adresse anlegen
     */
    async create(speise) {
        speise = speise || {};

        let newSpeise = {
            name_gericht:   speise.name_gericht || "",
            gericht_preis:  speise.gericht_preis  || "",
            gericht_nummer: speise.gericht_nummer      || "",
        };

        let result = await this._speisen.insertOne(newSpeise);
        return await this._speisen.findOne({_id: result.insertedId});
    }

    /**
     * Einzelne Adresse anhand ihrer ID lesen
     */
    async read(id) {
        let result = await this._speisen.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Einzelne Werte einer Adresse überschreiben
     */
    async update(id, speise) {
        let oldSpeise = await this.speisen.findeOne({_id: new ObjectId(id)});
        if (!oldSpeise) return;

        let updateDoc = {
            $set: {
                // Felder, die geändert werden sollen
            },
        };

        if (speise.name_gericht) updateDoc.$set.name_gericht = speise.name_gericht;
        if (speise.gericht_preis)  updateDoc.$set.gericht_preis  = speise.gericht_preis;
        if (speise.gericht_nummer)      updateDoc.$set.gericht_nummer      = speise.gericht_nummer;


        await this._speisen.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._speisen.findOne({_id: new ObjectId(id)});
    }

    /**
     * Einzelne Adresse löschen
     */
    async delete(id) {
        let result = await this._speisen.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
};