import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImgFastService } from '../img-fast.service';

@Component({
  selector: "app-img-fast",
  templateUrl: "./img-fast.component.html",
  styleUrls: ["./img-fast.component.scss"]
})
export class ImgFastComponent implements OnInit {
  constructor(public imgLoad: ImgFastService) { }

  imgSrc: string = "";


  ngOnInit() {
this.imgLoad.init();
    //Conversion functions
  }
}
