var glob = require("glob");
var fs = require("fs");

// Find files
glob("src/app/**/*.ngfactory.ts", function (err, files) {
    if (err) throw err;
   
   console.log(files.length + " files found");
   
    // Delete files
    files.forEach(function (item, index, array) {
        fs.unlink(item, function (err) {
            if (err) throw err;
            console.log(item + " deleted");
        });
    });
});