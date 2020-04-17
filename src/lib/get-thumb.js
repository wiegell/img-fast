// import { ExifParserFactory, ExifData } from 'ts-exif-parser/index'
// import { ExifParser } from 'ts-exif-parser/lib/ExifParser'
export default class thumb {
    // private parser: ExifParser | undefined;
    // private data: ExifData | undefined;
    constructor() {
        this.xhr = new XMLHttpRequest;
        this.xhr.open('GET', './test.jpg', true);
        this.xhr.setRequestHeader('Range', 'bytes=100-200'); // the bytes (incl.) you request
        this.xhr.responseType = "arraybuffer";
        this.xhr.onload = () => {
            let arrayBuffer = this.xhr.response;
            if (arrayBuffer) {
                // this.parser = ExifParserFactory.create(arrayBuffer);
                // this.data = ExifParserFactory.create(arrayBuffer).parse();
            }
        };
        this.xhr.send(null);
    }
    getExifData() {
        return 1;
        // if (this.data instanceof ExifData) {
        //     return this.data;
        // } else {
        //     throw console.error("no data loaded");
        // }
    }
}
