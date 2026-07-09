import { Component } from '@angular/core';
<<<<<<< HEAD
import { routes } from '../../../app/app.routes';

@Component({
  selector: 'app-home',
  imports: [],
=======
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
>>>>>>> 1534da5b0e706c65a98f3f9960cbcf7fc3e4e2dd
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
