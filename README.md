# oview
Zero dependency object viewer

Provides a means to display mulitple objects in a single view, with search and filter features.

## Instantiate an object viewer (simple)

A simple instance:

    // oview.make(<elem>); // set arg to the DIV id you want to put this into

    var myViewer = window.oview.make("target1");

## Instantiate an object viewer (with options)

     // oview.make({
     //    elem        // (required) the to put the viewer into. Can be DIV id (string), or use a physical DOM element.
     //    fontSize    // (optional) adjust text
     //    lineHeight  // (optional) adjust text
     //    font        // (optional) change font
     //    display     // (optional) choose theme, "dark" or "light"
     // });

    var myViewer = window.oview.make({
        elem        : "target1"     // the DIV id to put the viewer into
        fontSize    : 10,           // adjust text
        lineHeight  : 10,           // adjust text
        font        : "Helvetica",  // change font
        display     : "dark"        // choose theme, "dark" or "light"
    });

## Add objects to your viewer

    // myViewer.add(<object | json>[, label, cssClassName]);

    myViewer.add({
        foo : "bar",
        car : {
            make : "jeep",
            color : "black"
            engine : {
                cylinders : 6,
                size : "4 liter"
            }
        }
    }, "my entry");


# Example

    <html>
    <title>Object Viewer Example</title>
    
    <!-- object viewer -->
	<link href="oviwer.min.css" rel="stylesheet">
    <script src="oviwer.min.js"></script>

    <head>
        <script>
        document.addEventListener("DOMContentLoaded", () => {

            var myViewer = window.oview.make("target1");
            myViewer.add({
                bob : "er",
                sally : {
                    prop1 : 1,
                    prop2 : 2,
                    prop3 : 3
                }
            }, "my object label");

        });
        </script>
    </head>

    
    <body>
        <div id="target1">
    </body>
    
    </html>


## Style per entry
NOTE: See HTML simplified structure below to help define your css rules.

    <style>


    .my-klass-A .oview-folder-title {
        /* will apply to an object title */
        color : #FF0000 !important;
    }

    .my-klass-B .oview-folder-title {
        /* will apply to an object title */
        color : #00FF00 !important;
    }

    .my-klass-C .oview-folder-title {
        /* will apply to an object title */
        color : #0000FF !important;
    }

    .my-klass-C .oview-name {
        /* will apply to the key part of the key:value pairs */
        color : #FF0000 !important;
    }

    .my-klass-C .oview-value {
        /* will apply to the value part of the key:value pairs */
        color : #00FF00 !important;
    }

    .my-klass-C.oview-data-block {
        /* will apply to the overall entry block
            notice the rule definition does not seperated lass names with a space */
        color : #00FFFF !important;
        padding-top : 0px !important;
    }
    .my-klass-C .oview-folder-header {
        /* will apply to the sub-objects */
        padding-top : 5px !important;
    }

    .my-klass-C.oview-data-block > .oview-folder > .oview-folder-header {
        /* will apply to just the top-most title in an entry */
        color : #14a5f9 !important;
        padding-top : 10px !important;
        background-color : #CCCCCC;
    }

    </style>


    <script>
    document.addEventListener("DOMContentLoaded", () => {

        var myViewer = window.oview.make("target1");
        
        myViewer.add({
            bob : "er",
            sally : {
                prop1 : 1,
                prop2 : 2,
                prop3 : 3
            }
        }, "object A", "my-klass-A");

        myViewer.add({
            bob : "er",
            sally : {
                prop1 : 1,
                prop2 : 2,
                prop3 : 3
            }
        }, "object B", "my-klass-B");

        myViewer.add({
            bob : "er",
            sally : {
                prop1 : 1,
                prop2 : 2,
                prop3 : 3
            }
        }, "object C", "my-klass-C");



    });
    </script>


## Basic HTML Structure
This is provided to help construct your custom style rules

    <div class="oview-data-block oview-page my-css-klass">
        
        <div class="oview-folder">

            <label class="oview-folder-header oview-folder-title">entry tite</label>
            
            <div class="oview-folder-content">

                <div class="oview-data-line">
                    <span class="oview-name">bob</span>
                    <pre class="oview-tab-char">	</pre> <!-- the space between key and value -->
                    <span class="oview-value">er</span>
                </div>

                <div class="oview-data-line">
                    <span class="oview-name">prop1</span>
                    <pre class="oview-tab-char">	</pre>
                    <span class="oview-value oview-numeric">1</span> <!-- numeric values are detected -->
                </div>
                
            </div>

        </div>

    </div>