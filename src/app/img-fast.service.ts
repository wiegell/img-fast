import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, Subject, BehaviorSubject } from "rxjs";

//Set request header
let requestOptions: Object = { 
  headers: new HttpHeaders().set('Range', 'bytes=0-200'),
  responseType: 'arraybuffer'
}    

// {
//   headers: new HttpHeaders({
//     "Content-Type": "application/arraybuffer",
//     "Range": "bytes=0-200"
//   }),
//   responseType: 'arraybuffer',
// };

//Conversion funcs
function toHexString(byteArray) {
  return Array.from(byteArray, function(byte: number) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}
function _arrayBufferToBase64(bytes) {
  var binary = "";
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

@Injectable({
  providedIn: "root"
})
export class ImgFastService {
  constructor(private http: HttpClient) {}

  //Arrays
  private byteArray: Uint8Array;

  //Http declarations
  private $http: Observable<any>;
  private imgSrcSubj: BehaviorSubject<string> = new BehaviorSubject(" ");
  public $imgSrc: Observable<string> = this.imgSrcSubj.asObservable();
  public init(): void {
    this.$http = this.http.get(
      "https://upload.wikimedia.org/wikipedia/commons/d/da/Island_Archway,_Great_Ocean_Rd,_Victoria,_Australia_-_Nov_08.jpg?abc123",
      requestOptions
    );
    this.$http.subscribe(inputt => {
      if (inputt) {
        this.byteArray = new Uint8Array(inputt);
        // for (var i = 0; i < byteArray.byteLength; i++) {}
        console.log("Jagodawdo");
        let tmpArray = toHexString(this.byteArray);
        let tmpArray2 = "";
      for (let i = 0; i < tmpArray.length; i += 2) {
        tmpArray2 += tmpArray[i] + tmpArray[i + 1] + "h ";
      }

        console.log(tmpArray2);
      }
    });
  }

  //Make HTTP-request

  // xhr.open(
  //   "GET",
  //   "https://upload.wikimedia.org/wikipedia/commons/d/da/Island_Archway,_Great_Ocean_Rd,_Victoria,_Australia_-_Nov_08.jpg?abc123",
  //   true
  // );
  // xhr.responseType = "arraybuffer";
  // xhr.send();
}
