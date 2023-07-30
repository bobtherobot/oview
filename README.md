# oview
Zero dependency object viewer

Provides a means to display mulitple objects in a single view, with search fetures.

## Instanciate an object viwwer (simple)

A simple instance:

    // oview.make(<elem>); // set arg to the DIV id you want to put this into

    var myViewer = window.oview.make("target1");

## Instanciate an object viewer (with options)

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

    // myViewer.add(<object | json>[, label]);

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
	<link href="oviwer/oviwer.min.css" rel="stylesheet">
    <script src="oviwer/oviwer.min.js"></script>

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

    