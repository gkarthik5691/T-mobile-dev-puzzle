import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, switchMap } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { BOOKS_API_CONSTANT } from '../books-api.constant';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>(BOOKS_API_CONSTANT.READING_LIST_API).pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post(BOOKS_API_CONSTANT.READING_LIST_API, book).pipe(
          switchMap(() => [
              ReadingListActions.confirmedAddToReadingList({ book }),
              ReadingListActions.undoAddToReadingList({ book })
            ]),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`${BOOKS_API_CONSTANT.READING_LIST_API}/${item.bookId}`).pipe(
          switchMap(() => [
            ReadingListActions.confirmedRemoveFromReadingList({ item }),
            ReadingListActions.undoRemoveFromReadingList({ item })
          ]),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  undoAddToReadingList = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.undoAddToReadingList),
      concatMap(({ book }) => {
        return this.snackBarOperation(
          book.title + ' book is added to Reading List.',
          'Undo'
        )
          .onAction()
          .pipe(
            map(() =>
              ReadingListActions.removeFromReadingList({
                item: { ...book, bookId: book.id }
              })
            )
          );
      })
    )
  );

  undoRemoveFromReadingList = createEffect(() => this.actions$.pipe(
    ofType(ReadingListActions.undoRemoveFromReadingList),
    concatMap(({ item }) => {
      return this.snackBarOperation(
        item.title + ' book is removed from Reading list',
        'Undo'
      ).onAction()
        .pipe(
          map(() =>
            ReadingListActions.addToReadingList({
              book: { ...item, id: item.bookId }
            })
          )
        );
    })
    )
  );

  snackBarOperation(message: string, action: string) {
    return this.matSnackBar.open(message, action, {
      duration: 5000
    });
  }

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient, private matSnackBar: MatSnackBar) {}
}
