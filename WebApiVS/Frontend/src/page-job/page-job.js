"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-job.html";


export default class PageJob extends Page {
    
    constructor(app) {
        super(app, HtmlTemplate);

        this._emptyMessageElement = null;
    }

   
    async init() {
        
        await super.init();
        this._title = "Jobs anzeigen";
        console.log(this._app.backend.fetch("GET", "/job"));


        let result = await this._app.backend.fetch("GET", "/job");
        this._emptyMessageElement = this._mainElement.querySelector(".empty-placeholder");

        

        if (result.length) {
            this._emptyMessageElement.classList.add("hidden");
        }

        let olElement = this._mainElement.querySelector("ol");

        let templateElement = this._mainElement.querySelector(".list-entry");
        let templateHtml = templateElement.outerHTML;
        templateElement.remove();


        for (let index in result) {
           
            let dataset = result[index];
            let html = templateHtml;
            html = html.replace("$WORK$", dataset.work);
            html = html.replace("$DESCRIPTION$", dataset.description);
         
            let dummyElement = document.createElement("div");
            dummyElement.innerHTML = html;
            let liElement = dummyElement.firstElementChild;
            liElement.remove();
            olElement.appendChild(liElement);

            liElement.querySelector(".action.edit").addEventListener("click", () => location.hash = `#/update-job/${dataset._id}`);
            liElement.querySelector(".action.delete").addEventListener("click", () => this._askDelete(dataset._id));
        }
    }
    async _askDelete(id) {
        
        let answer = confirm("Soll die ausgewählte Job wirklich gelöscht werden?");
        if (!answer) return;

   
        try {
            this._app.backend.fetch("DELETE", `/job/${id}`);
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

      
        this._mainElement.querySelector(`[data-id="${id}"]`)?.remove();

        if (this._mainElement.querySelector("[data-id]")) {
            this._emptyMessageElement.classList.add("hidden");
        } else {
            this._emptyMessageElement.classList.remove("hidden");
        }
    }
};
