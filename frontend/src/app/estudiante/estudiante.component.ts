import { Component, OnInit } from '@angular/core';
import { faBookOpenReader, faDoorOpen, faFileLines, faGraduationCap, faHouseChimneyUser, faSignOutAlt, faAddressBook, faBook, faUsers, faUsersCog, faCogs } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css']
})
export class EstudianteComponent implements OnInit {
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
  faCogs=faCogs;
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
