"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-edit.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class PageList extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     */
    constructor(app) {
        super(app, HtmlTemplate);

        this._emptyMessageElement = null;
    }

    /**
     * HTML-Inhalt und anzuzeigende Daten laden.
     *
     * HINWEIS: Durch die geerbte init()-Methode wird `this._mainElement` mit
     * dem <main>-Element aus der nachgeladenen HTML-Datei versorgt. Dieses
     * Element wird dann auch von der App-Klasse verwendet, um die Seite
     * anzuzeigen. Hier muss daher einfach mit dem üblichen DOM-Methoden
     * `this._mainElement` nachbearbeitet werden, um die angezeigten Inhalte
     * zu beeinflussen.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();
        this._title = "Mahlzeit hinzufügen";
        //console.log(this._app.backend.fetch("GET", "/meal"));

        /*
        //// TODO: Anzuzeigende Inhalte laden mit this._app.backend.fetch() ////
        //// TODO: Inhalte in die HTML-Struktur einarbeiten ////
        //// TODO: Neue Methoden für Event Handler anlegen und hier registrieren ////


        // Platzhalter im HTML-Code ersetzen
        let html = this._mainElement.innerHTML;
        html = html.replace("$NAME$", this._dataset.name);
        html = html.replace("$PRICE$", this._dataset.price);
        html = html.replace("$SIZE$", this._dataset.size);
        this._mainElement.innerHTML = html;


        // Event Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder zur späteren Verwendung merken
        this._nameInput = this._mainElement.querySelector("input.name");
        this._priceInput  = this._mainElement.querySelector("input.price");
        this._sizeInput     = this._mainElement.querySelector("input.size");
        */
    }

    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset.name = this._nameInput.value.trim();
        this._dataset.price  = this._priceInput.value.trim();
        this._dataset.size      = this._sizeInput.value.trim();

        if (!this._dataset.name) {
            alert("Geben Sie erst einen Namen ein.");
            return;
        }

        if (!this._dataset.price) {
            alert("Geben Sie erst einen Preis ein.");
            return;
        }

        if (!this._dataset.size) {
            alert("Geben Sie erst eine Größe ein.");
            return;
        }

        // Datensatz speichern
        await this._app.database.save(this._dataset);

        // Zurück zur Übersicht
        location.hash = "#/";
    }
};
