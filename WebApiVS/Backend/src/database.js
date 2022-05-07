"use strict"

import { MongoClient } from "mongodb";


class DatabaseFactory {
    
    async init(connectionUrl) {
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("app_database");

        await this._createDemoData();
    }

    
    async _createDemoData() {
        
        let meal = this.database.collection("meal");

        if (await meal.estimatedDocumentCount() === 0) {
            meal.insertMany([
                {
                    name: "Pizza",
                    price: "8",
                    size: "large",
                }, {
                    name: "Burger",
                    price: "10",
                    size: "middle",
                }
            ]);
        }

        let guest = this.database.collection("guest");

        if (await guest.estimatedDocumentCount() === 0) {
            guest.insertMany([
                {
                    name: "Simon Mayer",
                    text: "Ein inneres Blumenpflücken",
                }, {
                    name: "Felix Schempf",
                    text: "Ich fand das Projekt mega",
                },{
                    name: "Johanna Simml",
                    text: "Das ist die schönste Speisekarte",
                },{
                    name: "Uwe",
                    text: "Ich bin der Uwe und ich bin auch dabei",
                }
            ]);
        }

        let job = this.database.collection("job");

        if (await job.estimatedDocumentCount() === 0) {
            job.insertMany([
                {
                    work: "Koch",
                    description: "Er bereitet das Essen zu",
                }, {
                    work: "Kellner",
                    description: "Bedient die Gäste",
                }
            ]);
        }
    }
}

export default new DatabaseFactory();
