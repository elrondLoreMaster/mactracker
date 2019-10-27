import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';
import {QueryDTO} from "../models/QueryDTO";

@Injectable({
    providedIn: 'root'
})

export class RestService {

    constructor(private http: HttpClient) {
    }

    /**
     * REST CALLS
     */
    getTreeArray(query: QueryDTO): Observable<any> {
        return this.http.post<any>("http://127.0.0.1:25000/api/query", query);
    }

}
