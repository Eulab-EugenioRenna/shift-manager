import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-fullwidth',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './fullwidth.component.html',
  styleUrl: './fullwidth.component.scss',
})
export class FullwidthComponent {

}
