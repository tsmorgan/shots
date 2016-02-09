var exec    = require('child_process').exec,
    fs      = require('fs'),
    pdfdoc  = require('pdfkit'),
    colors  = require('colors'),
    dir     = process.argv.slice(2)[0],
    done    = 0, data, json, pages;

// check whether they've passed a folder name in the command.
if (typeof dir == 'undefined') {
  console.log('Please pass in a folder name.'.red);
  process.exit();
}

/*
'Reading file           '
'generating screenshots '
'adding to PDF          '
'resizing images        '
'resizing thumbs        '
*/

// remove any trailing slash from the folder name.
if (dir.substr(-1) === '/') dir = dir.substr(0, dir.length - 1);

try {
  // right now check whether the folder exists.
  var s = fs.statSync(dir);
  // check the folder is in fact an actual folder.
  if (s.isDirectory())
  {
    // grab the data file from the folder.
    var datafile = __dirname + '/' + dir + '/data.json';
    console.log('Reading file           '.white+datafile.green);

    try {
      // read the datafile.
      var s = fs.statSync(datafile);
      data = fs.readFileSync(datafile).toString();
    } catch(err) {
      console.log("File doesn't exist!".red);
      console.log("You need a "+"data.json".yellow+" file in your "+dir.yellow+" folder.");
      process.exit();
    }

    try {
      json = JSON.parse(data);
    } catch (e) {
      // console.error(e);
      console.log("JSON isn\'t quite right in there.\n".red+
                  "Try pasting it in here: https://jsonformatter.curiousconcept.com/".red+
                  " and sort it out!");
      process.exit();
    }

    pages = json.pages;
    if (!json.browserWidth) json.browserWidth = 960;

    process.stdout.write('generating screenshots '.red);

    for (var i = 0; i < pages.length; i++)
    {
      if (typeof pages[i] == 'string')
      {
        var url = pages[i];
        var file = pages[i].replace(/\//g,'');
      } else {
        var url = pages[i][0];
        var file = pages[i][0].replace(/\//g,''), js = pages[i][1];
      }

      var command =   "webkit2png"
                    + " -W "+json.browserWidth
                    + " -TF "+json.webPath + url
                    + " -o "+dir+'/'+file
                    + " -s 1"
                    + " --ignore-ssl-check";

      if (js) command = command + " --js='"+js+"'";

      exec(command,function()
      {
        process.stdout.write('#'.white);
        // if we've done all of them set off the PDF creation.
        done++;
        if (done == pages.length)
        {
          process.stdout.write("\n");
          createPDF();
        }
      });
    };

  } else {

    // what they've passed isn't actually a folder.
    console.log('Hang on! That\'s not a folder.'.red);
  }

} catch(err) {

  // if the folder doesn't exist.
  if (err.code == "ENOENT") console.log("Oops! Folder ".red+dir.white+" doesn\'t exist!".red);
}

/*
  -------------------
  Function to create the PDF (honestly, just read the function name!)
  -------------------
*/
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
  for (var i = 0; i < pages.length; i++)
  {
    if (typeof pages[i] == 'string')
    {
      var filename = pages[i].replace(/\//g,'');
    } else {
      var filename = pages[i][0].replace(/\//g,'');
    }
    var file = dir+'/'+filename+'-full.png';
    var suffix  = file.substr(-4);
    process.stdout.write('#'.white);

    if (suffix == '.png')
    {
      if (typeof first != "undefined") doc.addPage();
      var first = true;
      doc.image(file,page.margin,page.margin,{width:page.width-2*page.margin});
    }

    // then delete the png file.
    if (!json.keepPNGs)
    {
      fs.unlink(file);
      var thumb = dir+'/'+filename+'-thumb.png';
      fs.unlink(thumb);
    }
  }

  // create the file.
  doc.pipe(fs.createWriteStream(dir+"/"+json.output));
  doc.end();
  process.stdout.write("\n");

  // then resize the images (if asked too)
  if (json.resize && json.keepPNGs == true) resizeImages();
  else process.stdout.write("and now I'm done.\n".green);
}

function resizeImages()
{
  var command = "mogrify -resize '"+json.resize.full_width+"' "+dir+"/*full.png";
  process.stdout.write("resizing images        ".magenta);
  exec(command,function()
  {
    process.stdout.write("done\n".white);
    resizeThumbs();
  });
}

function resizeThumbs()
{
  var command = "mogrify -resize '"+json.resize.thumb_width+"' "+dir+"/*thumb.png";
  process.stdout.write('resizing thumbs        '.cyan);
  exec(command,function()
  {
    process.stdout.write("done\n".white);
    process.stdout.write("and now I'm done.\n".green);
  });
}
