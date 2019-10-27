import {OnInit, ViewChild, ElementRef, Query} from '@angular/core';
import {Component} from '@angular/core';
import * as  Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';


More(Highcharts);
import Tree from 'highcharts/modules/treemap';

Tree(Highcharts);
import Heatmap from 'highcharts/modules/heatmap';

Heatmap(Highcharts);
// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';
import {TreemapService} from '../services/treemap.service';
import {MatInputModule} from '@angular/material';
import {RestService} from "../services/rest.service";
import {Filter} from "../models/Filter";
import {QueryDTO} from "../models/QueryDTO";
// Initialize exporting module.
Exporting(Highcharts);

@Component({
    selector: 'app-typography',
    templateUrl: './treemap.component.html',
    styleUrls: ['./treemap.component.css']
})
export class TreemapComponent implements OnInit {
    name: 'Group Z';
    treeMapIndex: number = 0;
    chart;
    @ViewChild('container', {read: ElementRef}) container: ElementRef;
    date: Date = new Date();
    settings = {
        bigBanner: true,
        timePicker: false,
        format: 'dd-MM-yyyy',
        defaultOpen: true
    }

    constructor(private treeMapService: TreemapService,
    ) {
    }


    sliderValueChanged(event: MatInputModule) {
        this.treeMapIndex = Number.parseInt(event.toString());
        this.treeMapService.setValues();
        this.chart.series[0].setData(this.treeMapService.treemap);
    }
    treeClicked($event) {
        let currentTreeValue = $event;
    }
    ngOnInit() {
        console.log(this.treeMapService.treemap);
        this.chart = Highcharts.chart(this.container.nativeElement, {
            colorAxis: {
                minColor: 'white',
                maxColor: 'white'
            },

            /**
             * The shape of the data
             */
            series: [{
                type: 'treemap',
                layoutAlgorithm: 'squarified',
                data: this.treeMapService.treemap,
            }],
            title: {
                text: 'MAC Tracker'
            }
        })
    }




}
