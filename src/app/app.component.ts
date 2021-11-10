import { Component, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { StopWatch } from './stopwatch.interface';
import { TimeService } from './timer.service';
import { take, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  // @ts-ignore
  public stopwatch: StopWatch;
  public startBtn = true;
  private subscriptions: Subscription = new Subscription();
  private subDbClick: Subscription = new Subscription();
  @ViewChild('dbClick')
  private dbClick!: ElementRef;

  constructor(private timerService: TimeService) {
    this.subscriptions.add(
      this.timerService.stopWatch$.subscribe(
        (val: StopWatch) => (this.stopwatch = val)
      )
    );
  }

  public startTimer(): void {
    this.startBtn = !this.startBtn;
    this.timerService.startTimer();
  }

  public waitTimer(): void {
    this.timerService.stopTimer();
    this.startBtn = !this.startBtn;
  }

  public resetTimer(): void {
    this.timerService.resetTimer();
    this.timerService.startTimer();
  }

  public stopTimer(): void {
    this.startBtn = true;
    this.timerService.resetTimer();
  }

  public dbClickCheck(): void {
    let lastClicked = 0;


    this.subDbClick = fromEvent(this.dbClick.nativeElement, 'click').pipe(take(2), tap(v => {
      const timeNow = new Date().getTime();
      if (timeNow < (lastClicked + 300)) { this.waitTimer(); }
      lastClicked = timeNow;
    })).subscribe();
  }

  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.subDbClick.unsubscribe();
  }
}
