import {
  actionClearFavourites$,
  actionAddToFavourites$,
  actionRemoveFromFavourites$,
  actionViewFavourites$
} from "./actions";
import { favourites$ } from "./favourites";
import { take } from "rxjs/operators";

describe("favourites.js", () => {
  beforeEach(() => {
    const favouritesPromise = favourites$.pipe(take(2)).toPromise();
    actionClearFavourites$.next();
    return favouritesPromise;
  });

  it("defaults to empty array", async () => {
    const favourites = await favourites$.pipe(take(1)).toPromise();

    expect(favourites).toEqual([]);
  });

  it("can have an new item added", async () => {
    const item = { stopCode: "1234", routeShortName: "NX1" };

    actionAddToFavourites$.next(item);

    const favouritesPromise = favourites$.pipe(take(2)).toPromise();

    expect(await favouritesPromise).toEqual([{ ...item, name: "NX1 at 1234" }]);
  });

  it("can have an existing item removed", async () => {
    const item = { stopCode: "1234", routeShortName: "NX1" };

    actionAddToFavourites$.next(item);
    actionRemoveFromFavourites$.next(item);

    const favouritesPromise = favourites$.pipe(take(3)).toPromise();

    expect(await favouritesPromise).toEqual([]);
  });

  it("can have the latest items when viewed", async () => {
    const item1 = { stopCode: "1234", routeShortName: "NX1" };
    const item2 = { stopCode: "5678", routeShortName: "NX2" };

    actionAddToFavourites$.next(item1);
    actionAddToFavourites$.next(item2);
    actionViewFavourites$.next();

    const favouritesPromise = favourites$.pipe(take(4)).toPromise();

    expect(await favouritesPromise).toEqual([
      { ...item1, name: "NX1 at 1234" },
      { ...item2, name: "NX2 at 5678" }
    ]);
  });

  it("can be cleared", async () => {
    const item1 = { stopCode: "1234", routeShortName: "NX1" };
    const item2 = { stopCode: "5678", routeShortName: "NX2" };

    actionAddToFavourites$.next(item1);
    actionAddToFavourites$.next(item2);
    actionClearFavourites$.next();

    const favouritesPromise = favourites$.pipe(take(4)).toPromise();

    expect(await favouritesPromise).toEqual([]);
  });
});
