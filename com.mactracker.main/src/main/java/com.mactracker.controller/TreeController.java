package com.mactracker.controller;

import com.mactracker.model.Query;
import com.mactracker.model.Tree;
import com.mactracker.model.TreeDataStorage_1;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class TreeController {
    @RequestMapping(value = "/query", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Tree> getTreeMap(@RequestBody Query query) {
        TreeDataStorage_1 treeDataStorage_1 = new TreeDataStorage_1();
        //List<Tree> treeMap = new ArrayList<>();
        try (Connection connection = DriverManager.getConnection("jdbc:postgresql://localhost:5432/postgres", "postgres", "fred")) {
            Class.forName("org.postgresql.Driver");
            Statement statement = connection.createStatement();
            int startTime = Integer.parseInt(query.getTimeStart());
            int stopTime = Integer.parseInt(query.getTimeStop());
            ArrayList<String> macList = null;
            if (query.getFilter() != null && query.getFilter().getMacList() != null) {
                macList = new ArrayList<String>(Arrays.asList(query.getFilter().getMacList().split(",")));
            }
            int filterStartTime = 0;
            int filterStopTime = 0;
            String filterLocation = null;

            if (query.getFilter() != null && query.getFilter().getStartTime() != null && query.getFilter().getStopTime() != null) {
                try {
                    startTime = Integer.parseInt(query.getTimeStart());
                    stopTime = Integer.parseInt(query.getTimeStop());
                    filterLocation = query.getFilter().getLocation();
                } catch (Exception e ) {}
            }


            if (macList == null && (filterStartTime > filterStopTime && filterLocation != null)) {
                macList = new ArrayList<String>();
                String fetch = "SELECT * FROM data WHERE time < " + String.valueOf(stopTime) + " and time > " + String.valueOf(startTime) + " and location = \'" + filterLocation + "\';";
                ResultSet resultSet = statement.executeQuery(fetch);
                while (resultSet.next()) {
                    for (String mac : resultSet.getString("MacList").split(",")) {
                        macList.add(mac);
                    }
                }
            }


            String fetch = "SELECT * FROM data WHERE time < " + String.valueOf(stopTime) + " and time > " + String.valueOf(startTime) + ";";
            ResultSet resultSet = statement.executeQuery(fetch);


            HashMap<String, ArrayList<String>> treeMacList = new HashMap<String, ArrayList<String>>();
            while (resultSet.next()) {
                String loc = resultSet.getString("Location");
                if (!treeMacList.containsKey(loc)) {
                    treeMacList.put(loc, new ArrayList<String>());
                }
                String [] macs = resultSet.getString("MacList").split(",");
                ArrayList<String> currentList = (ArrayList<String>)treeMacList.get(loc);
                for (String mac : macs) {
                    if (!currentList.contains(mac)) {
                        if ((macList != null && macList.contains(mac)) || macList == null) {
                            currentList.add(mac);
                        }
                    }
                }
                treeMacList.put(loc, currentList);
            }

            HashMap<String, Integer> treeMap = new HashMap<String, Integer>();
            for (String loc : treeMacList.keySet()) {
                treeMap.put(loc, treeMacList.get(loc).size());
            }

            System.out.println(treeMap);
            List<Tree>treeMapReturn = new ArrayList<Tree>();
            for (String loc : treeMap.keySet()) {
                treeMapReturn.add(new Tree(loc, treeMap.get(loc)));
            }

            return treeMapReturn;
        } catch (ClassNotFoundException e) {
            System.out.println("PostgreSQL JDBC driver not found.");
            e.printStackTrace();
        } catch (SQLException e) {
            System.out.println("Connection failure.");
            e.printStackTrace();
        }
        /*
         * Will need to pass query to db here. Commented out for now.
         */
        //treeMap = treeRepository().getTrees(query);
        return new ArrayList<Tree>();
    }
}