"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-job-edit.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class PageJobNew extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     * @param {Integer} editId ID des bearbeiteten Datensatzes
     */
    constructor(app, editId) {
        super(app, HtmlTemplate);

        this._editId = editId;

        this._dataset = {
            work: "",
            description: "",
        };

        // Eingabefelder
        this._workInput = null;
        this._descriptionInput  = null;   
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
        this._title = "Jobs hinzufügen";


        // Bearbeiteten Datensatz laden
        if (this._editId) {
            this._url = `/job/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.work}`;

        } else {
            this._url = `/job`;
            this._title = "Jobs hinzufügen";
        }

        // Platzhalter im HTML-Code ersetzen
        let html = this._mainElement.innerHTML;
        html = html.replace("$WORK$", this._dataset.work);
        console.log(this._workInput);
        html = html.replace("$DESCRIPTION$", this._dataset.description);
        this._mainElement.innerHTML = html;


        // Event Listener registrieren
        let jobSaveButton = this._mainElement.querySelector(".action.save");
        jobSaveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder zur späteren Verwendung merken
        this._workInput = this._mainElement.querySelector("input.work");
        console.log(this._workInput);
        this._descriptionInput  = this._mainElement.querySelector("input.description");
        
    }

    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset.work = this._workInput.value.trim();
        console.log(this._workInput);
        this._dataset.description  = this._descriptionInput.value.trim();

        if (!this._dataset.work) {
            alert("Geben Sie erst einen Job ein.");
            return;
        }

        if (!this._dataset.description) {
            alert("Geben Sie erst eine Beschreibung ein.");
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
        location.hash = "#/job/";
    }
};
