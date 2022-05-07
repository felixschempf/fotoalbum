"use strict";

export default class Backend {
    
    constructor() {
        this._url = "";
    }

   
    async init() {
        
        let response = await fetch("api.url");
        this._url = await response.text();

     
        while (this._url.endsWith("/")) {
            this._url = this._url.slice(0, this._url.length - 1);
        }
    }

    async fetch(method, url, options) {
        options = options || {};

     
        if (options.query) {
            let parameters = new URLSearchParams();

            for (name in options.query) {
                parameters.append(name, options.query[name]);
            }

            url = `${url}?${parameters}`;
        }

      
        let fetchOptions = {
            method: method,
            headers: options.headers || {},
            credentials: "include",
        };

        if (method !== "GET") {
            fetchOptions.headers["Content-Type"] = "application/json";

            if (options.body) {
                fetchOptions.body = JSON.stringify(options.body);
            }
        }

        fetchOptions.headers["Accept"] = "application/json";

       
        let response = await fetch(`${this._url}${url}`, fetchOptions);

        if (response.ok) {
            return await response.json();
        } else {
            
            let contentType = response.headers.get("Content-Type");

            if (contentType.includes("json")) {
                throw await response.json();
            } else {
                throw {
                    code: "SERVER_ERROR",
                    message: `HTTP ${response.status} ${response.statusText}: ${await response.text()}`,
                };
            }
        }
    }
}
