"use strict";

import Page from "../page.js";

/**
 * Klasse PageEdit: Stellt die Seite zum Anlegen oder Bearbeiten einer Adresse
 * zur Verfügung.
 */
export default class PageEdit extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     * @param {Integer} editId ID des bearbeiteten Datensatzes
     */
    constructor(app, editId) {
        super(app, "page-edit/page-edit.html");

        // Bearbeiteter Datensatz
        this._editId = editId;

        this._dataset = {
            first_name: "",
            bild: "",
            
        };

        // Eingabefelder
        this._firstNameInput = null;
        this._bildInput = null; 
        
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
     *
     * HINWEIS: In dieser Version der App wird mit dem üblichen DOM-Methoden
     * gearbeitet, um den finalen HTML-Code der Seite zu generieren. In größeren
     * Apps würde man ggf. eine Template Engine wie z.B. Nunjucks integrieren
     * und den JavaScript-Code dadurch deutlich vereinfachen.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();

        // Bearbeiteten Datensatz laden
        if (this._editId) {
            this._dataset = await this._app.database.getById(this._editId);
            this._title = `${this._dataset.first_name}`;
            
        } else {
            this._title = "Titel für das Foto hinzufügen";
        }

        // Platzhalter im HTML-Code ersetzen
        let html = this._mainElement.innerHTML;
        html = html.replace("$FIRST_NAME$", this._dataset.first_name);
        html = html.replace("$BILD$", this._dataset.bild);    
        
        this._mainElement.innerHTML = html;

        // Event Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder zur späteren Verwendung merken
        this._firstNameInput = this._mainElement.querySelector("input.first_name");
        this._bildInput = this._mainElement.querySelector("input.bild");

    }

    /**
     * Speichert den aktuell bearbeiteten Datensatz und kehrt dann wieder
     * in die Listenübersicht zurück.
     */
    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset.id         = this._editId;
        this._dataset.first_name = this._firstNameInput.value.trim();
        this._dataset.bild = this._bildInput.value.trim(); 
        
        
        if (!this._dataset.first_name) {
            alert("Bitte geben Sie einen Titel für das Bild ein");
            return;
        }
        
        if (!this._dataset.bild) {
            alert("Bitte geben Sie ein Bildpfad ein");
            return;
        }

        // Hier füge ich den Dateipfad zusammen. Es gehen nur Bilder die bereits im img Ordner sind
        this._dataset.bild = "<img src = 'img/" + this._dataset.bild + ".png'></img>";

        // Datensatz speichern
        await this._app.database.save(this._dataset);
        
        // Zurück zur Übersicht
        location.hash = "#/";
    }
    
};

