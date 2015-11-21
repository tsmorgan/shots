var sys     = require('sys'),
    exec    = require('child_process').exec,
    fs      = require('fs'),
    pdfdoc  = require('pdfkit'),
    colors  = require('colors'),
    data    = require(__dirname + '/data.js'); // this is the data.js file you need to use.

var done = 0;
var urls = data.urls;

process.stdout.write('generating screenshots '.red);
for (var i = 0; i < urls.length; i++) {
  
  var file = urls[i];
  exec("webkit2png -F " + data.webpath + file + "  -o "+file,function()
  {
    process.stdout.write('#'.white);
    // if we've done all of them set off the PDF creation.
    done++;
    if (done == urls.length) 
    {
      process.stdout.write("\n");
      createPDF();
    }
  });
};

function createPDF()
{
  process.stdout.write('adding to PDF          '.yellow);
  var page = {
    width:595,  // A4 width (in pts at 72dpi)
    height:842, // A4 height 
    margin:20   // margin!
  };      

  // create a document object
  var doc = new pdfdoc({size:[page.width,page.height]});

  // adding them all to the PDF
  for (var i = 0; i < urls.length; i++)
  {
    var file    = urls[i]+'-full.png';
    var suffix  = file.substr(-4);
    process.stdout.write('#'.white);

    if (suffix == '.png')
    {
      if (typeof first != "undefined") doc.addPage();
      var first = true;
      doc.image(file,page.margin,page.margin,{width:page.width-2*page.margin});
    }

    // then delete the png file.
    // fs.unlink(file);
  }  

  // create the file.
  doc.pipe(fs.createWriteStream(data.outputFilename));
  doc.end();
  process.stdout.write("\nwriting PDF\n".green);
}