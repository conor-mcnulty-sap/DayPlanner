namespace my.desk;

entity users {
    key ID: String;
    name: String;
    email: String;
}

entity desks {
    key ID : String;
    desk:  String;
    floor: Integer;
    building: String;
}

entity bookings {
    key ID: Integer;
    user: Association to users;
    desk: Association to desks;
    date: Date;
}


entity last_booked {
    key ID: Integer;
    user: Association to users;
    desk: Association to desks;
}

entity favourites {
    key ID: Integer;
    user: Association to users;
    number: String;
    desk: Association to desks;
}