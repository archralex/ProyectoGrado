import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faBookOpenReader, faDoorOpen, faFileLines, faGraduationCap, faHouseChimneyUser, faSignOutAlt, faAddressBook, faBook, faUsers } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth/services/auth.service';
@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.css']
})
export class ProtectedComponent implements OnInit {

  showFiller = false;
  faHouseChimneyUser=faHouseChimneyUser;
  faGraduationCap=faGraduationCap;
  faBookOpenReader=faBookOpenReader;
  faFileLines=faFileLines;
  faDoorOpen=faDoorOpen;
  faSignOutAlt=faSignOutAlt;
  faAddressBook = faAddressBook;
  faBook=faBook;
  faUsers=faUsers;
  get usuario(){
    return this.authService.usuario;
  }
  constructor(private router:Router,private authService:AuthService) { }
  logout() {
    this.router.navigateByUrl('/auth');
    this.authService.logout();
  }

  ngOnInit(): void {
  }

}
