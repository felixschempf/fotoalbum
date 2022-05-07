"use strict";

import Backend from "./backend.js";
import Router from "./router.js";
import "./app.css";


class App {
   
    constructor() {
        
        this.backend = new Backend();

       
        this.router = new Router([
            {
                url: "^/$",
                show: () => this._gotoList()
            },{
                url: "^/new/$",
                show: () => this._gotoNew()
            },{
                url: "^/update/(.*)$",
                show: matches => this._gotoUpdate(matches[1]),
            },{
                url: "^/guest/$",
                show: () => this._gotoGuest()
            },{
                url: "^/guest-edit/$",
                show: () => this._gotoGuestEdit()
            },{
                url: "^/updateGuest/(.*)$",
                show: matches => this._gotoUpdateGuest(matches[1]),
            },{
                url: "^/job/$",
                show: () => this._gotoJob()
            },{
                url: "^/job-new/$",
                show: () => this._gotoJobNew()
            },{
                url: "^/update-job/(.*)$",
                show: matches => this._gotoUpdateJob(matches[1]),
            },{
                url: ".*",
                show: () => this._gotoList()
            },

        ]);

        
        this._documentTitle = document.title;

        
        this._pageCssElement = document.querySelector("#page-css");
        this._bodyElement = document.querySelector("body");
        this._menuElement = document.querySelector("#app-menu");
    }

    
    async init() {
        try {
            await this.backend.init();
            this.router.start();
        } catch (ex) {
            this.showException(ex);
        }
    }

   
    async _gotoList() {
        try {
           
            let {default: PageList} = await import("./page-list/page-list.js");

            let page = new PageList(this);
            await page.init();
            this._showPage(page, "list");
        } catch (ex) {
            this.showException(ex);
        }
    }

    async _gotoNew() {
        try {
            
            let {default: PageEdit} = await import("./page-edit/page-edit.js");

            let page = new PageEdit(this);
            await page.init();
            this._showPage(page, "new");
        } catch (ex) {
            this._showException(ex);
        }
    }
    async _gotoUpdate(id) {
        try {
            
            let {default: PageEdit} = await import("./page-edit/page-edit.js");

            let page = new PageEdit(this, id);
            await page.init();
            this._showPage(page, "edit");
        } catch (ex) {
            this._showException(ex);
        }
    }

    async _gotoGuest() {
        try {
            
            let {default: PageEdit} = await import("./page-guest/page-guest.js");

            let page = new PageEdit(this);
            await page.init();
            this._showPage(page, "guest");
        } catch (ex) {
            this._showException(ex);
        }
    }

    async _gotoGuestEdit() {
        try {
            
            let {default: PageGuestEdit} = await import("./page-guest-edit/page-guest-edit.js");
            
            let page = new PageGuestEdit(this);
            
            await page.init();
            console.log("gotToGuest");
            this._showPage(page, "guest-edit");
        } catch (ex) {
            this._showException(ex);
        }
    }
    async _gotoUpdateGuest(id) {
        try {
      
            let {default: PageGuestEdit} = await import("./page-guest-edit/page-guest-edit.js");
            let page = new PageGuestEdit(this, id);
            await page.init();
            this._showPage(page, "updateGuest");
        } catch (ex) {
            this._showException(ex);
        }
    }
    async _gotoJob() {
        try {
            
            let {default: PageJob} = await import("./page-job/page-job.js");

            let page = new PageJob(this);
            await page.init();
            this._showPage(page, "job");
        } catch (ex) {
            this._showException(ex);
        }
    }
    

    async _gotoJobNew() {
        try {
            
            let {default: PageJobNew} = await import("./page-job-new/page-job-new.js");

            let page = new PageJobNew(this);
            await page.init();
            this._showPage(page, "job-new");
        } catch (ex) {
            this._showException(ex);
        }
    }
    async _gotoUpdateJob(id) {
        try {
            
            let {default: PageEdit} = await import("./page-job-new/page-job-new.js");

            let page = new PageEdit(this, id);
            await page.init();
            this._showPage(page, "update-job");
        } catch (ex) {
            this._showException(ex);
        }
    }

   
    _showPage(page, name) {
     
        document.title = `${this._documentTitle} – ${page.title}`;

      
        this._pageCssElement.innerHTML = page.css;

        
        this._menuElement.querySelectorAll("li").forEach(li => li.classList.remove("active"));
        this._menuElement.querySelectorAll(`li[data-page-name="${name}"]`).forEach(li => li.classList.add("active"));

        
        this._bodyElement.querySelector("main")?.remove();
        this._bodyElement.appendChild(page.mainElement);
    }

   
    showException(ex) {
        console.error(ex);

        if (ex.message) {
            alert(ex.message)
        } else {
            alert(ex.toString());
        }
    }
}


window.addEventListener("load", async () => {
    let app = new App();
    await app.init();
});
