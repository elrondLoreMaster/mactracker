import {Injectable} from '@angular/core';
import {TreeDTO} from "../models/TreeDTO";
import {QueryDTO} from "../models/QueryDTO";
import {Filter} from "../models/Filter";
import {RestService} from "./rest.service";

@Injectable({
    providedIn: 'root'
})
export class TreemapService {
    treemap: TreeDTO[];
    name = `Group z`;
    testQuery: QueryDTO;
    testFilter: Filter;

    constructor(private restService: RestService) {
        this.testFilter = new Filter();
        this.testQuery = new QueryDTO();
    }

    setValues() {
        this.testFilter.macList = "maclist";
        this.testFilter.startTime = "start time";
        this.testFilter.stopTime = "stop time";
        this.testQuery.filter = this.testFilter;
        this.testQuery.timeStart = "time start";
        this.testQuery.timeStop = "time stop";
        this.restService.getTreeArray(this.testQuery).subscribe((payload) => {
            this.treemap = payload;
            console.log(this.treemap);
            return this.treemap;
        });
    }
}
