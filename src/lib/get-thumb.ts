import { ExifParserFactory, ExifData } from 'ts-exif-parser';
import { ExifParser } from 'ts-exif-parser/lib/ExifParser'

class thumb {
    private xhr = new XMLHttpRequest;
    private parser: ExifParser | undefined;
    private data: ExifData | undefined;
    private src: string;
    private it: number;
    private HTTPProm: Promise<ExifData>;

    constructor(it: number, src: string) {
        this.it = it;
        this.src = src;
        this.HTTPProm = new Promise((resolve: (ED: ExifData) => void, reject: (Err: Error) => void) => {
            this.xhr.open('GET', this.src, true);
            this.xhr.setRequestHeader('Range', 'bytes=0-15000'); // the bytes (incl.) you request
            this.xhr.responseType = "arraybuffer";
            this.xhr.onload = () => {
                if (this.xhr.status === 200 || this.xhr.status === 206) {
                    // If successful, resolve the promise by passing back the request response
                    let arrayBuffer = this.xhr.response;
                    if (arrayBuffer) {
                        this.parser = ExifParserFactory.create(arrayBuffer);
                        this.data = ExifParserFactory.create(arrayBuffer).parse();
                        resolve(this.data);
                    }


                } else {
                    // If it fails, reject the promise with a error message
                    reject(Error('Image didn\'t load successfully; error code:' + this.xhr.statusText));
                }

            }

        })


    }

    public getHTTPonLoadPromise(): Promise<ExifData> {
        return this.HTTPProm;
    }

    public sendHTTP(): void {
        this.xhr.send(null);
    }

    public getExifData(): ExifData {
        if (this.data instanceof ExifData) {
            return this.data;
        } else {
            throw console.error("no data loaded: " + this.it + " " + this.src.substr(this.src.length - 10));
        }
    }
}

export { thumb }


