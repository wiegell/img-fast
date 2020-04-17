import { ExifParserFactory, ExifData } from 'ts-exif-parser';
import { ExifParser } from 'ts-exif-parser/lib/ExifParser'

class thumb {
    private xhr = new XMLHttpRequest;
    private parser: ExifParser | undefined;
    private data: ExifData | undefined;

    constructor() {
        this.xhr.open('GET', './test.jpg', true);
        this.xhr.setRequestHeader('Range', 'bytes=100-200'); // the bytes (incl.) you request
        this.xhr.responseType = "arraybuffer";
        this.xhr.onload = () => {
            let arrayBuffer = this.xhr.response;
            if (arrayBuffer) {
                this.parser = ExifParserFactory.create(arrayBuffer);
                this.data = ExifParserFactory.create(arrayBuffer).parse();
            }
        }
        this.xhr.send(null);
    }

    public getExifData(): ExifData {
        if (this.data instanceof ExifData) {
            return this.data;
        } else {
            throw console.error("no data loaded");
        }
    }
}

export { thumb }


