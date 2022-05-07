"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-guest-edit.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class PageGuestEdit extends Page {
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
            name: "",
            text: "",
        };

        // Eingabefelder
        this._nameInput = null;
        this._textInput  = null;   
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
        this._title = "In Gästebuch eintragen";


        // Bearbeiteten Datensatz laden
        if (this._editId) {
            this._url = `/guest/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.name}`;

        } else {
            this._url = `/guest`;
            this._title = "Gästebuch-Eintrag hinzufügen";
        }

        // Platzhalter im HTML-Code ersetzen
        let html = this._mainElement.innerHTML;
        html = html.replace("$NAME$", this._dataset.name);
        html = html.replace("$TEXT$", this._dataset.text);
        this._mainElement.innerHTML = html;


        // Event Listener registrieren
        let guestSaveButton = this._mainElement.querySelector(".action.save");
        guestSaveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder zur späteren Verwendung merken
        this._nameInput = this._mainElement.querySelector("input.name");
        this._textInput  = this._mainElement.querySelector("input.text");
        
    }
};
