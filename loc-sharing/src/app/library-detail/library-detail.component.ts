import { Component, OnInit, Input } from '@angular/core';
import { Library } from '../library'
import { Seat } from '../seat';
import { SEATS } from '../mock-seats';
import { Location } from '@angular/common';

@Component({
  selector: 'app-library-detail',
  templateUrl: './library-detail.component.html',
  styleUrls: ['./library-detail.component.css']
})

export class LibraryDetailComponent implements OnInit {

  @Input() library: Library;

  seats = SEATS;

  selectedSeat : Seat;

  onSelect(seat: Seat): void {
    this.selectedSeat = seat;
  }

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
  }

  goBack(): void {
    this.location.back();
  }

}
