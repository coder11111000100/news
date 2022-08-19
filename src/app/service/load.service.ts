import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { filter, map, Observable } from 'rxjs';

export interface INews {
  id: number;
  title: string;
  description: string;
  publishedDate: Date;
  url?: string;
  fullUrl?: string;
  titleImageUrl: string | ArrayBuffer | null;
  categoryType?: string;
}

type TypeNews = { news: INews[] };

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  news: INews | undefined;
  constructor(private http: HttpClient) {}

  fetchNews(page: number = 1, count: number = 10): Observable<INews[]> {
    return this.http
      .get<TypeNews>(`https://webapi.autodoc.ru/api/news/${page}/${count}`, {
        observe: 'body',
        responseType: 'json',
      })
      .pipe(map((item) => item.news));
  }

  setByNews(item: INews): void {
    this.news = item;
  }
}
