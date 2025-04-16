import { Observable, timer, Subscription, Subject, fromEvent, partition } from 'rxjs';
import { sampleTime, startWith, switchMap, takeUntil, shareReplay, repeatWhen } from 'rxjs/operators';
import { intervalBackoff } from 'backoff-rxjs';

export class Poller {
  // five seconds
  private static INITIAL_INTERVAL = 5000;
  private static MULTIPLIER = 1.5;
  // one minute
  private static MAX_INTERVAL = 60_000;

  private successfulPoll = new Subject<void>();
  private pollerObs: Observable<void>;
  private subscription: Subscription;
  private func: () => Promise<boolean>;

  constructor(func: () => Promise<boolean>) {
    this.func = func;

    const [visible, hidden] = partition(
      fromEvent(document, 'visibilitychange').pipe(
        shareReplay({ refCount: true, bufferSize: 1 })
      ),
      () => document.visibilityState === 'visible'
    );

    this.pollerObs = this.successfulPoll.pipe(
      // limit calls
      sampleTime(Poller.INITIAL_INTERVAL),

      // Start immediately
      startWith(null),

      // Resetting exponential interval operator
      switchMap(() => intervalBackoff({
        initialInterval: Poller.INITIAL_INTERVAL,
        maxInterval: Poller.MAX_INTERVAL,
        backoffDelay: (iteration: number, initialInterval: number) => Math.pow(Poller.MULTIPLIER, iteration) * initialInterval,
      })),
      switchMap(() => this.call()),
      takeUntil(hidden),
      repeatWhen(() => visible),
    );
    this.subscription = this.pollerObs.subscribe();
  }

  stop() {
    this.subscription.unsubscribe();
  }

  async call() {
    if(await this.func.call(null)) {
      this.successfulPoll.next();
    }
  }
}
