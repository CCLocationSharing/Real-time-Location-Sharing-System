import { Component, OnInit } from '@angular/core';
import { Request } from '../request';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css']
})

export class ReserveComponent implements OnInit {

  request : Request = {
    seatId:0,
    libraryName:'Example Library',
    startTime:1200,
    endTime:1230
  };

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
  }

  goBack(): void {
    this.location.back();
  }

}
