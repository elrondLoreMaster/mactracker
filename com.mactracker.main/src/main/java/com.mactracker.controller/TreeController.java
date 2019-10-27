package com.mactracker.controller;

import com.mactracker.model.Query;
import com.mactracker.model.Tree;
import com.mactracker.model.TreeDataStorage_1;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class TreeController {
    @RequestMapping(value = "/query", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Tree> getTreeMap(@RequestBody Query query) {
        TreeDataStorage_1 treeDataStorage_1 = new TreeDataStorage_1();
        List<Tree> treeMap = new ArrayList<>();

        /*
         * Will need to pass query to db here. Commented out for now.
         */
        //treeMap = treeRepository().getTrees(query);
        treeMap = treeDataStorage_1.treeArray;
        return treeMap;
    }
}
