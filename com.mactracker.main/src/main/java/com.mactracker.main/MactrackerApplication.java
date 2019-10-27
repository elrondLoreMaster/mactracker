package com.mactracker.main;

import com.mactracker.model.TreeDataStorage_1;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        scanBasePackages = {
                "com.mactracker.main",
                "com.mactracker.controller"})
public class MactrackerApplication {

    public static void main(String[] args) {
        TreeDataStorage_1 dataStorage_1 = new TreeDataStorage_1();
        SpringApplication.run(MactrackerApplication.class, args);
    }

}
