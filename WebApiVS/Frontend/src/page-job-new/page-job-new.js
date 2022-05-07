"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-job-new.html";

export default class PageJobNew extends Page {
   
    constructor(app, editId) {
        super(app, HtmlTemplate);

        this._editId = editId;

        this._dataset = {
            work: "",
            description: "",
        };

        this._workInput = null;
        this._descriptionInput  = null;   
    }
    async init() {
        
        await super.init();
        this._title = "Jobs hinzufügen";


      
        if (this._editId) {
            this._url = `/job/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.work}`;

        } else {
            this._url = `/job`;
            this._title = "Jobs hinzufügen";
        }

        
        let html = this._mainElement.innerHTML;
        html = html.replace("$WORK$", this._dataset.work);
        html = html.replace("$DESCRIPTION$", this._dataset.description);
        this._mainElement.innerHTML = html;


        let jobSaveButton = this._mainElement.querySelector(".action.save");
        jobSaveButton.addEventListener("click", () => this._saveAndExit());

        this._workInput = this._mainElement.querySelector("input.work");
        this._descriptionInput  = this._mainElement.querySelector("input.description");
        
    }
    async _saveAndExit() {
       
        this._dataset.work = this._workInput.value.trim();
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

       
        location.hash = "#/job/";
    }
};