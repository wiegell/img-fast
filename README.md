# img-fast

## Work in progress
img-fast is a framwork-agnostic typescript ES6 web component meant to load images nicer (and faster). The goals are:

* Quickly get info (dimensions, thumbnail, etc.) by range requesting the first few kilobytes of all images on page.
* Make SVG-placeholder with correct proportions
* Prioritize full size downloads with intersection-observer (lazy load)
* Where possible load the EXIF-thumbnail of jpeg's as placeholder
* Support multiple server side resolutions (to rerender higher quality stepwise)

So far the only dependencies are ts-exif-parser and ts-bus

Head back for examples soon!