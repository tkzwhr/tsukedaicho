\c tsukedaicho

create table users
(
    id       serial
        constraint users_pk
            primary key,
    name     varchar(32) not null,
    slack_id varchar(32),
    position int         not null,
    unique (name),
    unique (position) DEFERRABLE INITIALLY DEFERRED
);

create table tsukes
(
    id           serial
        constraint tsukes_pk
            primary key,
    date         date not null,
    from_user_id int  not null
        constraint tsukes_from_user_id_users_id_fk
            references users,
    to_user_id   int  not null
        constraint tsukes_to_user_id_users_id_fk
            references users,
    amount       int  not null,
    description  text not null
);
