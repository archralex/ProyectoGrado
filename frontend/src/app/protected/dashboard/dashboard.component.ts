import { Component, OnInit } from '@angular/core';
import { faBookOpenReader, faGraduationCap, faFileLines, faAddressBook, faBook } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  faBookOpenReader = faBookOpenReader;
  faGraduationCap=faGraduationCap;
  faFileLines = faFileLines;
  faAddressBook=faAddressBook;
  faBook=faBook;
  ngOnInit(): void {
  }

}
