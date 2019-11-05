package com.mactracker.model;

public class Query {
    private String timeStart;
    private String timeStop;
    private Filter filter;

    public String getTimeStart() {
        return timeStart;
    }

    public String getTimeStop() {
        return timeStop;
    }

    public Filter getFilter() {
        return filter;
    }
}
