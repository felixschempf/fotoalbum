import DatabaseFactory from "../database.js";
import { ObjectId } from "mongodb";


export default class MealService {
    
    constructor() {
        this._meals = DatabaseFactory.database.collection("meal");
    }

    
    async search(query) {
        let cursor = this._meals.find(query, {
            sort: {
                name: 1,
                price: 1,
            }
        });

        return cursor.toArray();
    }

    
    async create(meal) {
        meal = meal || {};

        let newMeal = {
            name:    meal.name || "",
            price:   meal.price  || "",
            size:    meal.size      || "",
        };

        let result = await this._meals.insertOne(newMeal);
        return await this._meals.findOne({_id: result.insertedId});
    }

    
    async read(id) {
        let result = await this._meals.findOne({_id: new ObjectId(id)});
        return result;
    }

    
    async update(id, meal) {
        let oldMeal = await this._meals.findOne({_id: new ObjectId(id)});
        if (!oldMeal) return;

        let updateDoc = {
            $set: {
                
            },
        };

        if (meal.name)      updateDoc.$set.name = meal.name;
        if (meal.price)     updateDoc.$set.price  = meal.price;
        if (meal.size)      updateDoc.$set.size      = meal.size;

        await this._meals.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._meals.findOne({_id: new ObjectId(id)});
    }

    
    async delete(id) {
        let result = await this._meals.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
};
