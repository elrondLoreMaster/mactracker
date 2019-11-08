import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {NgModule, OnInit, ViewChild, ElementRef, VERSION, Query} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Component} from '@angular/core';
import * as  Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';
import {TreeDTO} from '../models/TreeDTO';

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
    // Most current start time
    start;
    // Most current stop time
    stop;
    // Most current slider value
    sliderValue;
    // Formatted time
    showTime: string;
    // Vars to manipulate capture
    isCapture: boolean;
    captureStart;
    captureStop;
    capturedLocation;
    // Vars to manipulate slider
    tick;
    step;
    min = 1;
    max = 24;
    treeMapIndex: number = 0;
    blanktremap = [];
    // Vars for datepickers
    pickerOne = new Date();
    pickerTwo = new Date();
    interval;
    // HighCharts treemap is an Array of Objects
    treemap: [];
    // Name of our group
    name = `Group z`;
    // Query object to pass to backend
    query: QueryDTO;
    // Filter object to pass to backend
    filter: Filter;
    // Chart is needed to update treemap after initialization
    chart;
    // Known bug: read:ElementRef, if compiler complains, make an edit to the page to force recompile - it will resolve the issue.
    @ViewChild('container', {read: ElementRef}) container: ElementRef;


    constructor(private treeMapService: TreemapService,
                private restService: RestService) {
        this.query = new QueryDTO();
        this.filter = new Filter();
    }

    ngOnInit() {
        this.tick = 1;
        this.step = 1;
        this.min = 0;
        this.max = 23;

        /*
         * Get start time and stop time as
         * the current date
         */
        let startDate = new Date();
        let endDate = new Date();
        startDate.setUTCHours(5, 0, 0, 0);
        endDate.setUTCHours(6, 0, 0, 0);
        this.start = startDate.getTime() / 1000;
        this.stop = endDate.getTime() / 1000;
        console.log("START: " + startDate.getTime() / 1000);
        console.log("STOP: " + endDate.getTime() / 1000);
        this.getTreemapArray(startDate.getTime() / 1000, endDate.getTime() / 1000);
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
                //data: this.getTreemapArray()
                data: this.blanktremap,
            }],
            title: {
                text: 'MAC Tracker'
            }
        })
    }

    formatLabel(value: number | null) {
        if (!value) {
            return 0;
        }

        let decimalPart = +value.toString().replace(/^[^\.]+/, '0');
        let mm = decimalPart * 60;
        var mmPart = mm.toString().length == 1 ? mm.toString() + "0" : mm.toString();

        if (value >= 0) {
            let valueStr = value.toFixed(2);
            let strArr = valueStr.split(".");
            if (strArr[0].length == 1) {
                strArr[0] = "0" + strArr[0];
            }
            var hhPart = strArr[0];
            //console.log(strArr);
        }

        return hhPart + ":" + mmPart;
    }


    dateRangeAndIntervalSelected() {
        this.tick = this.interval;
        // To calculate the time difference of two dates
        let Difference_In_Time = this.pickerTwo.getTime() - this.pickerOne.getTime();
        // To calculate the no. of days between two dates
        let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        // Set max by getting values from Differnce In Days * 24
        this.max = Difference_In_Days * 24;
        console.log(
            "Picker 1 getDate: " + this.pickerOne.getDate().toString() +
            "Picker 2 getDate: " + this.pickerTwo.getDate().toString() +
            "Picker 1 getTime: " + this.pickerOne.getTime().toString() +
            "Picker 2 getTime: " + this.pickerOne.getTime().toString() +
            "Difference_In_Time = " + Difference_In_Time +
            "Difference In Days: = " + Difference_In_Days

        );
    }

    onChangeRange(rangeValue: any) {
        //console.log(rangeValue);
        this.showTime = rangeValue.value;
        this.sliderValue = rangeValue.value;
        //console.log(this.formatLabel(rangeValue.value));
        this.treeMapIndex = Number.parseInt(rangeValue);
        //this.chart.series[0].setData(this.getTreemapArray());

        /*
         * Capture the event and pass to getTreeMapArray:
         * 1. Start Time
         * 2. Stop Time
         */
        let startDate = new Date();
        let endDate = new Date();
        startDate.setUTCHours(rangeValue.value + 5, 0, 0, 0);
        endDate.setUTCHours(rangeValue.value + 6, 0, 0, 0);
        console.log("START: " + startDate.getTime() / 1000);
        console.log("STOP: " + endDate.getTime() / 1000);
        if (this.isCapture) {
            this.getTreeMapArrayForCapture(this.start, this.stop, startDate.getTime() / 1000, endDate.getTime() / 1000, this.capturedLocation);
        } else {
            this.getTreemapArray(startDate.getTime() / 1000, endDate.getTime() / 1000);
        }
    }


    treeClicked(value: any) {
        this.capturedLocation = value.point.name;
        this.isCapture = true;
    }


    getTreemapArray(start, stop) {
        this.filter.macList = null;
        this.filter.startTime = null;
        this.filter.stopTime = null;
        this.query.filter = null;
        this.query.timeStart = start;
        this.query.timeStop = stop;
        this.restService.getTreeArray(this.query).subscribe((payload) => {
            this.treemap = payload;
            this.chart.series[0].setData(this.treemap);
            console.log(this.treemap);
        });
    }

    getTreeMapArrayForCapture(start, stop, captureStart, captureStop, location) {
        this.filter.macList = null;
        this.filter.startTime = captureStart;
        this.filter.stopTime = captureStop;
        this.filter.location = location;
        this.query.filter = this.filter;
        this.query.timeStart = start;
        this.query.timeStop = stop;
        this.restService.getTreeArray(this.query).subscribe((payload) => {
            this.treemap = payload;
            this.chart.series[0].setData(this.treemap);
            console.log(this.treemap);
        });
    }

    setCaptureToFalse(){
        this.isCapture = false;
    }


}
