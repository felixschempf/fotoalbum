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
     * @param {Integer} editId ID des bearbeiteten Datensatzes
     */
    constructor(app) {
        super(app, HtmlTemplate);
        
        // Bearbeiteter Datensatz
        this._editId = editId;

        this._dataset = {
            name: "",
            price: "",
            size: "",
        };

        // Eingabefelder
        this._nameInput = null;
        this._priceInput  = null;
        this._sizeInput     = null;
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
/*
        // Bearbeiteten Datensatz laden
        if (this._editId) {
            this._url = `/meal/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.name}`;

        } else {
            this._url = `/meal`;
            this._title = "Gericht hinzufügen";
        }

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
        
        try {
            if (this._editId) {
                await this._app.backend.fetch("PUT", this._url, {body: this._dataset});
            } else {
                await this._app.backend.fetch("POST", this._url, {body: this._dataset});
            }
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/";
    }
};
