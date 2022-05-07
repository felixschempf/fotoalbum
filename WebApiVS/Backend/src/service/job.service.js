import DatabaseFactory from "../database.js";
import { ObjectId } from "mongodb";


export default class JobService {
    
    constructor() {
        this._jobs = DatabaseFactory.database.collection("job");
    }

    
    async search(query) {
        let cursor = this._jobs.find(query, {
            sort: {
                work: 1,
            }
        });

        return cursor.toArray();
    }

    
    async create(job) {
        job = job || {};

        let newJob = {
            work:    job.work || "",
            description:   job.description  || "",
        };

        let result = await this._jobs.insertOne(newJob);
        return await this._jobs.findOne({_id: result.insertedId});
    }

    
     async read(id) {
        let result = await this._jobs.findOne({_id: new ObjectId(id)});
        return result;
    }

    
    async update(id, job) {
        let oldJob = await this._jobs.findOne({_id: new ObjectId(id)});
        if (!oldJob) return;

        let updateDoc = {
            $set: {
                
            },
        };

        if (job.work)      updateDoc.$set.work = job.work;
        if (job.description)     updateDoc.$set.description  = job.description;

        await this._jobs.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._jobs.findOne({_id: new ObjectId(id)});
    }

    
    async delete(id) {
        let result = await this._jobs.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
};