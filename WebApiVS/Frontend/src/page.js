"use strict";


export default class Page {
   
    constructor(app, htmlString) {
        this._app = app;

        this._htmlString = htmlString;
        this._title = "???";
        this._cssString = null;
        this._mainElement = null;
    }

   
    async init() {
        let dummyElement = document.createElement("div");
        dummyElement.innerHTML = this._htmlString;

        this._cssString = dummyElement.querySelector("style")?.innerHTML;
        this._mainElement = dummyElement.querySelector("main");
        this._mainElement.remove();
    }

    get title() {
        return this._title;
    }
    
    get css() {
        return this._cssString;
    }

       get mainElement() {
        return this._mainElement;
    }
}
