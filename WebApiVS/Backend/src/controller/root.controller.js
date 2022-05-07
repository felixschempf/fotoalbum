"use strict"

import {wrapHandler} from "../utils.js";
import path from "path";
import { readFile } from "fs/promises";



 export default class RootController {
 
    constructor(server, prefix, openApiFile) {
        this._openApiFile = openApiFile;

        server.get(prefix, wrapHandler(this, this.index));
        server.get(prefix + "openapi.yaml", wrapHandler(this, this.openApi));
    }

    
    async index(req, res, next) {
       
        res.sendResult([
            {
                _name: "guest",
                query: {url: "/guest", method: "GET", queryParams: ["name", "text"]},
                create: {url: "/guest", method: "POST"},
            },
            {            
                 _name: "meal",
                 query: {url: "/meal", method: "GET", queryParams: ["name", "price", "size"]},
                 create: {url: "/meal", method: "POST"},
            },
            {
                _name: "job",
                query: {url: "/job", method: "GET", queryParams: ["work", "description"]},
                create: {url: "/job", method: "POST"},
            }
        ]);

        next();
    }

    async openApi(req, res, next) {
        let filecontent = await readFile(this._openApiFile);

        res.status(200);
        res.header("content-type", "application/openapi+yaml");
        res.sendRaw(filecontent);

        next();
    }
 }
