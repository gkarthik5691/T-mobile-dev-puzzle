import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { createReadingListItem, SharedTestingModule } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { BOOKS_API_CONSTANT } from '../books-api.constant';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne(BOOKS_API_CONSTANT.READING_LIST_API).flush([]);
    });
  });

  describe('finishedReadingBook$', () => {
    it('Should invoke confirmedFinishedReadingBook action once finish Book API is successful', done => {
      actions = new ReplaySubject();
      const readingList = createReadingListItem('A');
      actions.next(ReadingListActions.finishedReadingBook({ item: readingList }));
      const finishedBook = {
        ...readingList,
        finished: true,
        finishedDate: '2020-01-01T00:00:00.000Z'
      };
      effects.finishBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedFinishedReadingBook({
            item: finishedBook
          })
        );
        done();
      });

      httpMock.expectOne(`${BOOKS_API_CONSTANT.READING_LIST_API}/A/finished`).flush({
        ...finishedBook
      });
    });

    it('Should invoke failedFinishedReadingBook action if finish Book API returns error', done => {
      actions = new ReplaySubject();
      const readingList = createReadingListItem('A');
      actions.next(ReadingListActions.finishedReadingBook({ item: readingList }));
      effects.finishBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.failedFinishedReadingBook({
            error: 'Error'
          })
        );
        done();
      });

      httpMock.expectOne(`${BOOKS_API_CONSTANT.READING_LIST_API}/A/finished`)
        .error(new ErrorEvent('HttpErrorResponse'),
          { status: 500, statusText: 'Error' });
    });
  });

});
