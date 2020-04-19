import { ExifParserFactory, ExifData } from 'ts-exif-parser';


export class Loader {
    private xhr = new XMLHttpRequest;

    private data: ExifData | undefined;
    private src: string;
    private HTTPProm: Promise<ArrayBuffer>;
    private AB: Buffer | undefined;

    constructor(src: string) {
        this.src = src;
        this.HTTPProm = new Promise((resolve: (AB: Buffer) => void, reject: (Err: Error) => void) => {
            this.xhr.open('GET', this.src, true);
            this.xhr.setRequestHeader('Range', 'bytes=0-15000'); // the bytes (incl.) you request
            this.xhr.responseType = "arraybuffer";
            this.xhr.onload = () => {
                if (this.xhr.status === 200 || this.xhr.status === 206) {
                    // If successful, resolve the promise by passing back the request response

                    this.AB = this.xhr.response;
                    if (this.AB instanceof ArrayBuffer) {
                        resolve(this.AB);
                    } else {
                        "Failed to load as buffer"
                    }
                } else {
                    // If it fails, reject the promise with a error message
                    reject(Error('Image didn\'t load successfully; error code:' + this.xhr.statusText));
                }

            }

        })


    }

    public getHTTPonLoadPromise(): Promise<ArrayBuffer> {
        return this.HTTPProm;
    }

    public sendHTTP(): void {
        this.xhr.send(null);
    }

    public getExifData(): ExifData {
        if (this.data instanceof ExifData) {
            return this.data;
        } else {
            throw console.error("no data loaded: " + this.src.substr(this.src.length - 10));
        }
    }
}


