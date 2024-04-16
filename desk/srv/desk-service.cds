using my.desk as my from '../db/data-model';

service DeskService {
    entity users @readonly as projection on my.users;
    entity bookings as projection on my.bookings;
    entity desks @readonly as projection on my.desks;
    entity last_booked as projection on my.last_booked;
    entity favourites as projection on my.favourites;
}