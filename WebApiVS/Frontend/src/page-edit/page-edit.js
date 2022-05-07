"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-edit.html";


export default class PageList extends Page {
        constructor(app, editId) {
        super(app, HtmlTemplate);
        
       
        this._editId = editId;

        this._dataset = {
            name: "",
            price: "",
            size: "",
        };

       
        this._nameInput = null;
        this._priceInput  = null;
        this._sizeInput     = null;
    }

    
    async init() {
        
        await super.init();
        this._title = "Mahlzeit hinzufügen";

        
        if (this._editId) {
            this._url = `/meal/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.name}`;

        } else {
            this._url = `/meal`;
            this._title = "Gericht hinzufügen";
        }

        
        let html = this._mainElement.innerHTML;
        html = html.replace("$NAME$", this._dataset.name);
        html = html.replace("$PRICE$", this._dataset.price);
        html = html.replace("$SIZE$", this._dataset.size);
        this._mainElement.innerHTML = html;


        
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        
        this._nameInput = this._mainElement.querySelector("input.name");
        this._priceInput  = this._mainElement.querySelector("input.price");
        this._sizeInput      = this._mainElement.querySelector("input.size");


      
        
    }

    async _saveAndExit() {
        
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

        location.hash = "#/";
    }
};
