\c tsukedaicho

INSERT INTO users (id, name, slack_id, position) VALUES (1, 'user1', 'slack1', 1);
INSERT INTO users (id, name, slack_id, position) VALUES (2, 'user2', null, 2);
INSERT INTO users (id, name, slack_id, position) VALUES (3, 'user3', 'slack3', 3);

INSERT INTO tsukes (id, date, from_user_id, to_user_id, amount, description) VALUES (1, '2021-01-01', 1, 2, 100, 'Bought chocolate');
INSERT INTO tsukes (id, date, from_user_id, to_user_id, amount, description) VALUES (2, '2021-01-02', 2, 1, 50, 'Bought lollipop');
INSERT INTO tsukes (id, date, from_user_id, to_user_id, amount, description) VALUES (3, '2021-01-02', 3, 1, 100, 'Bought coffee');
