import {
  actionAddToFavourites$,
  actionRemoveFromFavourites$,
  actionClearFavourites$,
  actionViewFavourites$,
  actionViewRoute$,
  actionViewStop$,
  actionViewTrip$
} from "./actions";

describe("action.js", () => {
  it.each(
    Object.entries({
      actionAddToFavourites$,
      actionRemoveFromFavourites$,
      actionClearFavourites$,
      actionViewFavourites$,
      actionViewRoute$,
      actionViewStop$,
      actionViewTrip$
    })
  )("%s is a subject", (name, action$) => {
    const done = action$.toPromise();

    action$.subscribe(value => {
      expect(value).toBe("test");
      done();
    });

    action$.next("test");
    action$.complete();

    return done;
  });
});
