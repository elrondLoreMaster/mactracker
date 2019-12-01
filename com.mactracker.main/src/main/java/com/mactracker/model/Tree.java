package com.mactracker.model;

import java.util.Random;

public class Tree {

    String name;
    int value;
    int colorValue;

    public Tree(String name, int value){
        this.name = name;
        this.value = value;
        this.colorValue = value;

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public int getColorValue() {
        return colorValue;
    }

    public void setColorValue(int colorValue) {
        this.colorValue = colorValue;
    }

    private int getRandomValue() {
        int min = 1;
        int max = 100;
        Random r = new Random();
        return r.ints(min, (max + 1)).limit(1).findFirst().getAsInt();
    }

}
