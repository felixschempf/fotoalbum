import DatabaseFactory from "../database.js";
import { ObjectId } from "mongodb";

/**
 * Fachliche Anwendungslogik für alles rund um Adressdatensätze.
 */
export default class JobService {
    /**
     * Konstruktor
     */
    constructor() {
        this._jobs = DatabaseFactory.database.collection("job");
    }

    /**
     * Adressen suchen
     */
    async search(query) {
        let cursor = this._jobs.find(query, {
            sort: {
                work: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Adresse anlegen
     */
    async create(job) {
        job = job || {};

        let newJob = {
            work:    job.work || "",
            description:   job.description  || "",
        };

        let result = await this._jobs.insertOne(newJob);
        return await this._jobs.findOne({_id: result.insertedId});
    }

    /**
     * Einzelne Adresse anhand ihrer ID lesen
     */
     async read(id) {
        let result = await this._jobs.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Einzelne Werte einer Adresse überschreiben
     */
    async update(id, job) {
        let oldJob = await this._jobs.findOne({_id: new ObjectId(id)});
        if (!oldJob) return;

        let updateDoc = {
            $set: {
                // Felder, die geändert werden sollen
            },
        };

        if (job.work)      updateDoc.$set.work = job.work;
        if (job.description)     updateDoc.$set.description  = job.description;

        await this._jobs.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._jobs.findOne({_id: new ObjectId(id)});
    }

    /**
     * Einzelne Adresse löschen
     */
    async delete(id) {
        let result = await this._jobs.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
};