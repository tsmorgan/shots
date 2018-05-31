var fs = require('fs')
var prompt = require('prompt')
var exec = require('child_process').exec

// generic output folder for shots
var outputdir = __dirname + "/o"
// if it doesn't exist create it
if (!fs.existsSync(outputdir)) fs.mkdirSync(outputdir);

prompt.colors = false
prompt.start()
prompt.get([{
  name: 'newfolder',
  description: 'Name',
  required: true,
  type: 'string'
}],function(err, result)
{
  // specific output dir
  var shotsdir = outputdir + "/" + result.newfolder
  // if it doesn't exist create it
  if (!fs.existsSync(shotsdir)) fs.mkdirSync(shotsdir);
  // copy example datafile into it.
  fs.writeFileSync(shotsdir+'/data.json', fs.readFileSync("data.json"));
  // open data file.
  exec("atom-beta "+shotsdir+'/data.json',function(err,stdout,stderr)
  {
    if (err) console.log(err)
  });
})
