# SHOTS
A way to quickly create a PDF of screens of a gov.uk prototype.

## Getting started

###  Webkit2PNG
Although the script is written in Node it uses a Python script called [webkit2png](http://www.paulhammond.org/webkit2png/) to create the screenshots. Bit weird I know, it means you’ll need to install that first. I think [Homebrew](http://brew.sh/) is the easiest way. 

```brew install webkit2png```

> **WARNING!** If you’re on El Crapitan there might be another hurdle to jump to do with added security. You might need to [edit the webkit2png](https://github.com/bendalton/webkit2png/commit/9a96ac8977c386a84edb674ca1518e90452cee88) script to get around this.

###  Setting up (first time only)

Once you've got webkit2png installed: 

* [download the zip](https://github.com/morganesque/shots/archive/master.zip) and unpack it.

* Open up Terminal and `cd` into the resulting folder.

* Install the node modules using `npm install`

###  Setting up (each time)

In order to create a set of screens and/or a PDF there's a couple of things you need to do:

* Create a folder for them to go into (ie. `mkdir <foldername>`)

* Copy `data.js` into this folder. (ie. `cp data.js <foldername>`)

* Edit your new `data.js`

### data.js
```json
{
  "webPath": "http://domain/path/path/",
  "outputFilename": "screens.pdf",
  "keepPNGs": true,
  "pages": [
    "page1",
    "page2",
    "page3",
    "page4",
  ],
}
```

`webPath` – This is the root of the prototype you’re screen-shotting. That’s just the URL without the final page name at the end.

`outputFilename` - The name of the resulting PDF which will appear in your new folder.

`keepPNGS` - Can you `true` or `false` and decides whether the PNG screenshots are retained or deleted after the PDF has been created.

`pages` - This is an array of page names in your prototype. They'll be appended to the webPath to generate the URL of the page to be grabbed. The order is how they’ll appear in the PDF.

### Run it

Enter `node pdf.js <foldername>` and sit back and watch the magic happen!

&nbsp;
&nbsp;
&nbsp;
&nbsp;

## Explanation

OK if you're interested here's a bit of reasoning behind doing this and the specific way it's put together. I read this [blog post about screen shots of gov.uk pages](https://designnotes.blog.gov.uk/2015/10/15/how-and-why-to-print-all-the-things/) and found out about both [Paparazzi!](https://derailer.org/paparazzi/) and [webkit2png](http://www.paulhammond.org/webkit2png/) and then possibly automating the printing out of screens from the prototype I was working on. 

I wanted to achieve the following:

1. **Avoid one-by-one printing using an app or a chrome extension** - This is too annoying and time consuming.

2. **Be able to hit print on the resulting file or files** - I found I could drag a bunch of images into Preview (on Mac) and either print them or export them to a PDF but longer pages were either shrunk to fit the paper, causing the size of the pages to vary greatly, or the longer pages stretched onto the following page meaning another (usually needless) sheet was printed.

3. **Have the resulting PDF be in the right order** - This was a kind of side issue but it cropped up a couple of times when members of my team needed a quick PDF of the prototype for something and I ended up manually reordering a PDF in Preview page-by-page.

So having the a data file which could both define the pages to be printed but also the order to print them seemed to work best. Creating a new folder for each different screengrabbing felt like a good way to go and then maintaining the option to retain or simple delete the PNGs that were created along the way seemed like a useful thing too.


