"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-list.html";

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
        this._title = "Speisekarte";
        
       

        //// TODO: Anzuzeigende Inhalte laden mit this._app.backend.fetch() ////
        let inhalt = this._app.backend.fetch("GET", "/address");
        var input = inhalt;
        function doc(){
            document.write(input);
        }
        console.log("inhalt:")
        console.log(inhalt)
        //// TODO: Inhalte in die HTML-Struktur einarbeiten ////

        //// TODO: Neue Methoden für Event Handler anlegen und hier registrieren ////
    }
};
