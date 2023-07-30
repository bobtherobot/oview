var myfs = require("myfs");
var { minify } = require("terser");


/*
# run
cd /Volumes/Drives/projects/object-viewer
node ./build.js
*/

var list = [
	"src/mark.min.js",
	"src/utils.js",
	"src/InputHistory.js",
	"src/display.js",
	"src/Entry.js",
	"src/save.js",
	"src/toolbar.js",
	"src/process.js",
	"src/MakeUi.js",
	"src/main.js"
];

async function run(){
    var str = "";
    for(var i=0; i<list.length; i++){
        var data = myfs.open(list[i]);
        str += ";" + data + ";\n";
    }
    var result = await minify(str);
    myfs.save("dist/oview.min.js", result.code);

    myfs.cpdir("css/fonts", "dist/assets/fonts");
    myfs.cpdir("images", "dist/assets");

    var fontCss = myfs.listExt("css/fonts", ["css"]);
    console.log("fontCss", fontCss);

    // CSS
    var cssFonts = ""
    for(var i=0; i<fontCss.length; i++){
        var data = myfs.open(fontCss[i]);
        cssFonts += "\n" + data + "\n";
    }
    cssFonts = cssFonts.replace(/url\('/mg, "url('assets/fonts/");

    var cssApp = myfs.open("css/app.css");
    cssApp = cssApp.replace(/\.\.\/images\//mg, "assets/");
    myfs.save("dist/oview.min.css", cssFonts + "\n" + cssApp);

    // cleanup
    myfs.remove("dist/assets/toolbar/_ExportCrap.jsx");
    myfs.remove("dist/assets/toolbar/_source.ai");
    myfs.remove("dist/assets/fonts/Menlo-Bold.css");
    myfs.remove("dist/assets/fonts/Menlo-Regular.css");
    
    console.log("DONE")

}


run();


