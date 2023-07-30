oview.add({
    bob : "er",
    sally : {
        prop1 : 1,
        prop2 : 2,
        prop3 : 3
    }
});


oview.add({
    bob : "er",
    sally : {
        prop1 : 1,
        prop2 : 2,
        prop3 : 3
    }
}, "this is my header");

oview.add(`{
    "bob" : "json good",
    "sally" : {
        "prop1" : 1,
        "prop2" : 2,
        "prop3" : 3
    }
}`, "real json");

oview.add(`{
    bob : "json js obj",
    sally : {
        prop1 : 1,
        prop2 : 2,
        prop3 : 3
    }
}`, "js js obj");
