import { Component, OnInit } from '@angular/core';
import { Library } from '../library';
import { LIBRARIES } from '../mock-libraries';
import { Location } from '@angular/common';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.css']
})
export class LibrariesComponent implements OnInit {

  libraries = LIBRARIES;

  library : Library = {
    id : 1,
    name : 'Olin Library'
  };

  selectedLibrary : Library;

  onSelect(library: Library): void {
    this.selectedLibrary = library;
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
