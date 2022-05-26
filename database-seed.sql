CREATE TABLE users
(
    id SERIAL,
    email text,
    username text,
    password text,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

INSERT INTO users(email, username, password) VALUES
 ('test_1@email.com', 'anonim_1', 'test_1'),
 ('test_2@email.com', 'anonim_2', 'test_2');