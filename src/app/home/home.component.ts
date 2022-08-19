import {
  AfterViewInit,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  BehaviorSubject,
  Subscription,
  map,
  pairwise,
  filter,
  throttleTime,
  timer,
} from 'rxjs';
import { LoadService, INews } from '../service/load.service';
import { Router } from '@angular/router';
import { DisINews } from '../form-news/form-news.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport)
  scroller: CdkVirtualScrollViewport;
  localNewsArray: DisINews[] = [];
  modal = false;
  loading = false;
  numbers: number[] = [1];
  count = 1;
  sub: Subscription;
  state$: BehaviorSubject<number[]> = new BehaviorSubject([1]);
  news: DisINews[] = [];
  constructor(
    private sevice: LoadService,
    private ngzone: NgZone,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.scroller
      .elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 100),
        throttleTime(200)
      )
      .subscribe(() => {
        this.ngzone.run(() => {
          this.sevice.fetchNews(this.count, 10).subscribe((item) => {
            const news = [...this.news, ...item];
            if (news.length > this.news.length) {
              this.onPushItem();
              this.news = news;
            }
          });
        });
      });
  }

  ngOnInit(): void {
    const newsItem = JSON.parse(localStorage.getItem('news') || 'null');
    this.sub = this.sevice.fetchNews(1, 20).subscribe((item) => {
      this.loading = true;
      timer(2000).subscribe(() => (this.loading = false));
      if (newsItem) {
        this.onPushItem();
        this.news = [...newsItem, ...this.news, ...item];
      } else {
        this.news = [...this.news, ...item];
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onPushItem(): void {
    this.count++;
    this.numbers.push(1);
    this.state$.next(this.numbers);
  }

  onAddNews(newsItem: DisINews): void {
    this.localNewsArray.push(newsItem);
    localStorage.setItem('news', JSON.stringify(this.localNewsArray));
    this.news = [newsItem, ...this.news];
    this.onPushItem();
    this.modal = false;
  }

  goToPost(item: INews) {
    this.sevice.setByNews(item);
    this.router.navigate(['/post', item.id]);
  }

  onClick() {
    this.modal = !this.modal;
  }
}
