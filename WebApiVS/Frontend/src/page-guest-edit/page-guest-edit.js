"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-guest-edit.html";


export default class PageGuestEdit extends Page {
   
    constructor(app, editId) {
        super(app, HtmlTemplate);

        this._editId = editId;

        this._dataset = {
            name: "",
            text: "",
        };

        
        this._nameInput = null;
        this._textInput  = null;   
    }

   
    async init() {
      
        await super.init();
        this._title = "In Gästebuch eintragen";


        
        if (this._editId) {
            this._url = `/guest/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.name}`;

        } else {
            this._url = `/guest`;
            this._title = "Gästebuch-Eintrag hinzufügen";
        }

        let html = this._mainElement.innerHTML;
        html = html.replace("$NAME$", this._dataset.name);
        html = html.replace("$TEXT$", this._dataset.text);
        this._mainElement.innerHTML = html;


        let guestSaveButton = this._mainElement.querySelector(".action.save");
        guestSaveButton.addEventListener("click", () => this._saveAndExit());

        this._nameInput = this._mainElement.querySelector("input.name");
        this._textInput  = this._mainElement.querySelector("input.text");
        
    }

    async _saveAndExit() {
     
        this._dataset.name = this._nameInput.value.trim();
        this._dataset.text  = this._textInput.value.trim();

        if (!this._dataset.name) {
            alert("Geben Sie erst einen Namen ein.");
            return;
        }

        if (!this._dataset.text) {
            alert("Geben Sie erst einen Text ein.");
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

       
        location.hash = "#/guest/";
    }
};
