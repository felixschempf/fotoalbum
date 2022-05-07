import {wrapHandler} from "../utils.js";
import RestifyError from "restify-errors";
import GuestService from "../service/guest.service.js";


export default class GuestController {
    
    constructor(server, prefix) {
        this._prefix = prefix;
        this._service = new GuestService();

        
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

       
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.put(prefix + "/:id", wrapHandler(this, this.update));
        server.patch(prefix + "/:id", wrapHandler(this, this.update));
        server.del(prefix + "/:id", wrapHandler(this, this.delete));
    }

  
    _insertHateoasLinks(entity) {
        let url = `${this._prefix}/${entity._id}`;

        entity._links = {
            read:   {url: url, method: "GET"},
            update: {url: url, method: "PUT"},
            patch:  {url: url, method: "PATCH"},
            delete: {url: url, method: "DELETE"},
        }
    }

    
    async search(req, res, next) {
      
        let result = await this._service.search(req.query);

        
        result.forEach(entity => this._insertHateoasLinks(entity));

        
        res.sendResult(result);
        return next();
    }

    
    async create(req, res, next) {
        
        let result = await this._service.create(req.body);

       
        this._insertHateoasLinks(result);

        
        res.status(201);
        res.header("Location", `${this._prefix}/${result._id}`);
        res.sendResult(result);
        return next();
    }

    
    async read(req, res, next) {
        
        let result = await this._service.read(req.params.id);

        
        if (result) {
            this._insertHateoasLinks(result);
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Datensatz nicht gefunden");
        }

        return next();
    }

    
    async update(req, res, next) {
        
        let result = await this._service.update(req.params.id, req.body);

        
        if (result) {
            this._insertHateoasLinks(result);
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Datensatz nicht gefunden");
        }

        return next();
    }

    
    async delete(req, res, next) {
        
        await this._service.delete(req.params.id);

        res.status(204);
        res.sendResult({});
        return next();
    }
};