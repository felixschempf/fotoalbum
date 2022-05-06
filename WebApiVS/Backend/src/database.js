"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen. Stattdessen kann
 * einfach das Singleton-Objekt dieser Klasse importiert und das Attribut
 * `mongodb` oder `database` ausgelesen werden.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann. Hier wird dann
     * auch gleich die Verbindung hergestellt.
     *
     * @param {String} connectionUrl URL-String mit den Verbindungsdaten
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("app_database");

        await this._createDemoData();
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */
    async _createDemoData() {
        //// TODO: Methode anpassen, um zur eigenen App passende Demodaten anzulegen ////
        //// oder die Methode ggf. einfach löschen und ihren Aufruf oben entfernen.  ////
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
                    name: "Eintrag 1",
                    text: "Das ist ein Beispieltext",
                }, {
                    name: "Eintrag 2",
                    text: "Das ist ein zweiter Beispieltext",
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
