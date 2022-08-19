import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { INews } from '../service/load.service';

export interface DisINews extends INews {
  isButton?: boolean;
}

@Component({
  selector: 'app-form-news',
  templateUrl: './form-news.component.html',
  styleUrls: ['./form-news.component.css'],
})
export class FormNewsComponent implements OnInit {
  imagePreview: string | ArrayBuffer | null;
  @Output()
  addNews: EventEmitter<DisINews> = new EventEmitter();
  newsForm = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
  });

  constructor() {}

  ngOnInit(): void {}
  onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    let c = 56798765;
    c++;
    this.addNews.emit({
      id: c,
      title: this.newsForm.value.title,
      description: this.newsForm.value.description,
      publishedDate: new Date(),
      titleImageUrl: this.imagePreview,
      isButton: true,
    });
    this.newsForm.reset();
  }
}
