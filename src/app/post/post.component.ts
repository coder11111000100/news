import { Component, OnInit } from '@angular/core';
import { INews, LoadService } from '../service/load.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  news: INews | null | undefined;
  constructor(private service: LoadService) {}

  ngOnInit(): void {
    this.news = this.service.news;
  }
}
