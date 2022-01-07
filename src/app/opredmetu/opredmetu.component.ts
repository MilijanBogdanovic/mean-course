import { Component, OnInit } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import { Post } from '../posts/post.model';

@Component({
  selector: 'app-opredmetu',
  templateUrl: './opredmetu.component.html',
  styleUrls: ['./opredmetu.component.css']
})
export class OpredmetuComponent implements OnInit {

  isClicked:boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  pritisnut() {
    this.isClicked = true;
  }
}
