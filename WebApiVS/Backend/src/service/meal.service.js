import DatabaseFactory from "../database.js";
import { ObjectId } from "mongodb";

/**
 * Fachliche Anwendungslogik für alles rund um Adressdatensätze.
 */
export default class MealService {
    /**
     * Konstruktor
     */
    constructor() {
        this._meals = DatabaseFactory.database.collection("meal");
    }

    /**
     * Adressen suchen
     */
    async search(query) {
        let cursor = this._meals.find(query, {
            sort: {
                name: 1,
                price: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Adresse anlegen
     */
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

    /**
     * Einzelne Adresse anhand ihrer ID lesen
     */
    async read(id) {
        let result = await this._meals.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Einzelne Werte einer Adresse überschreiben
     */
    async update(id, meal) {
        let oldMeal = await this._meals.findOne({_id: new ObjectId(id)});
        if (!oldMeal) return;

        let updateDoc = {
            $set: {
                // Felder, die geändert werden sollen
            },
        };

        if (meal.name)      updateDoc.$set.name = meal.name;
        if (meal.price)     updateDoc.$set.price  = meal.price;
        if (meal.size)      updateDoc.$set.size      = meal.size;

        await this._meals.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._meals.findOne({_id: new ObjectId(id)});
    }

    /**
     * Einzelne Adresse löschen
     */
    async delete(id) {
        let result = await this._meals.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
};
