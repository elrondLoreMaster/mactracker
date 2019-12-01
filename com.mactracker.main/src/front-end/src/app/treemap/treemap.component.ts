import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {NgModule, OnInit, ViewChild, ElementRef, VERSION, Query} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Component} from '@angular/core';
import * as  Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';
import {TreeDTO} from '../models/TreeDTO';
import { ExportToCsv } from 'export-to-csv';

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
    options;
    csvExporter;


    // Known bug: read:ElementRef, if compiler complains, make an edit to the page to force recompile - it will resolve the issue.
    @ViewChild('container', {read: ElementRef}) container: ElementRef;


    constructor(private treeMapService: TreemapService,
                private restService: RestService) {
        this.query = new QueryDTO();
        this.filter = new Filter();
    }
    ngOnInit() {

        this.options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: true,
            title: 'Treemap',
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
            // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
        };

        this.csvExporter = new ExportToCsv(this.options);


        this.tick = 1;
        this.step = 1;
        this.min = 0;
        this.max = 23;

        /*
         * When treemap loads grabbing November 30th at 12AM - 1AM
         * because full network logs have not been parsed for current
         * date
         */
        let startDate = new Date('November 30, 2019 00:00:00');
        let endDate = new Date('November 30, 2019 01:00:00');
        startDate.setUTCHours(5, 0, 0, 0);
        endDate.setUTCHours(6, 0, 0, 0);
        this.start = startDate.getTime() / 1000;
        this.stop = endDate.getTime() / 1000;
        console.log("START: " + startDate.getTime() / 1000);
        console.log("STOP: " + endDate.getTime() / 1000);

        /*
         * Uncomment these lines to get the current on treemap initialization.
         * Get start time and stop time as
         * the current date
         */
        // let startDate = new Date();
        // let endDate = new Date();
        // startDate.setUTCHours(5, 0, 0, 0);
        // endDate.setUTCHours(6, 0, 0, 0);
        // this.start = startDate.getTime() / 1000;
        // this.stop = endDate.getTime() / 1000;
        // console.log("START: " + startDate.getTime() / 1000);
        // console.log("STOP: " + endDate.getTime() / 1000);
        this.getTreemapArray(startDate.getTime() / 1000, endDate.getTime() / 1000);
        this.chart = Highcharts.chart(this.container.nativeElement, {
            colorAxis: {
                minColor: '#e8f5e9',
                maxColor: '#4caf50'
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

    // formatLabel(value: number | null) {
    //     if (!value) {
    //         return 0;
    //     }
    //     let decimalPart = +value.toString().replace(/^[^\.]+/, '0');
    //     let mm = decimalPart * 60;
    //     var mmPart = mm.toString().length == 1 ? mm.toString() + "0" : mm.toString();
    //
    //     if (value >= 0) {
    //         let valueStr = value.toFixed(2);
    //         let strArr = valueStr.split(".");
    //         if (strArr[0].length == 1) {
    //             strArr[0] = "0" + strArr[0];
    //         }
    //         var hhPart = strArr[0];
    //         //console.log(strArr);
    //     }
    //     return hhPart + ":" + mmPart;
    // }

    formatLabel(value: number | null) {
        if (!value) {
            return '12:00AM';
        }
        console.log("Value:" + value);
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
            console.log(hhPart);
        }

        switch(hhPart) {
            case '01': {
                //statements;
                return '1:00AM';
                break;
            }
            case '02': {
                //statements;
                return '2:00AM';
                break;
            }
            case '03': {
                //statements;
                return '3:00AM';
                break;
            }
            case '04': {
                //statements;
                return '4:00AM';
                break;
            }
            case '05': {
                //statements;
                return '5:00AM';
                break;
            }
            case '06': {
                //statements;
                return '6:00AM';
                break;
            }
            case '07': {
                //statements;
                return '7:00AM';
                break;
            }
            case '08': {
                //statements;
                return '8:00AM';
                break;
            }
            case '09': {
                //statements;
                return '9:00AM';
                break;
            }
            case '10': {
                //statements;
                return '10:00AM';
                break;
            }
            case '11': {
                //statements;
                return '11:00AM';
                break;
            }
            case '12': {
                //statements;
                return '12:00PM';
                break;
            }
            case '13': {
                //statements;
                return '1:00PM';
                break;
            }
            case '14': {
                //statements;
                return '2:00PM';
                break;
            }
            case '15': {
                //statements;
                return '3:00PM';
                break;
            }
            case '16': {
                //statements;
                return '4:00PM';
                break;
            }
            case '17': {
                //statements;
                return '5:00PM';
                break;
            }
            case '18': {
                //statements;
                return '6:00PM';
                break;
            }
            case '19': {
                //statements;
                return '7:00PM';
                break;
            }
            case '20': {
                //statements;
                return '8:00PM';
                break;
            }
            case '21': {
                //statements;
                return '9:00PM';
                break;
            }
            case '212': {
                //statements;
                return '10:00PM';
                break;
            }
            case '23': {
                //statements;
                return '11:00PM';
                break;
            }
            case '24': {
                //statements;
                return '12:00PM';
                break;
            }
            case '25': {
                //statements;
                return '1:00AM';
                break;
            }
            case '26': {
                //statements;
                return '2:00AM';
                break;
            }
            case '27': {
                //statements;
                return '3:00AM';
                break;
            }
            case '28': {
                //statements;
                return '4:00AM';
                break;
            }
            case '29': {
                //statements;
                return '5:00AM';
                break;
            }
            case '30': {
                //statements;
                return '6:00AM';
                break;
            }
            case '31': {
                //statements;
                return '7:00AM';
                break;
            }
            case '32': {
                //statements;
                return '8:00AM';
                break;
            }
            case '33': {
                //statements;
                return '9:00AM';
                break;
            }
            case '34': {
                //statements;
                return '10:00AM';
                break;
            }
            case '35': {
                //statements;
                return '11:00AM';
                break;
            }
            case '36': {
                //statements;
                return '12:00PM';
                break;
            }
            case '37': {
                //statements;
                return '1:00PM';
                break;
            }
            case '38': {
                //statements;
                return '2:00PM';
                break;
            }
            case '39': {
                //statements;
                return '3:00PM';
                break;
            }
            case '40': {
                //statements;
                return '4:00PM';
                break;
            }
            case '41': {
                //statements;
                return '5:00PM';
                break;
            }
            case '42': {
                //statements;
                return '6:00PM';
                break;
            }
            case '43': {
                //statements;
                return '7:00PM';
                break;
            }
            case '44': {
                //statements;
                return '8:00PM';
                break;
            }
            case '45': {
                //statements;
                return '9:00PM';
                break;
            }
            case '46': {
                //statements;
                return '10:00PM';
                break;
            }
            case '47': {
                //statements;
                return '11:00PM';
                break;
            }
            case '48': {
                //statements;
                return '12:00PM';
                break;
            }







            default: {
                //statements;
                return hhPart + ":" + mmPart;
                break;
            }
        }



        //return hhPart + ":" + mmPart;
    }

    dateRangeAndIntervalSelected() {
        //this.tick = this.interval;
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

    exportAsCsv(){
        this.csvExporter.generateCsv(this.treemap);
    }


}
