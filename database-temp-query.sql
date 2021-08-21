CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_id uuid DEFAULT uuid_generate_v4 (),
    name varchar(255),
    phone_number varchar(255) not null,
    profile_picture_key varchar(255),
    cognito_id varchar(255),
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(user_id)
);

CREATE TABLE spaces (
    space_id uuid DEFAULT uuid_generate_v4 (),
    name varchar(255),
    description varchar(255) not null,
    picture_key varchar(255),
    approvalPercentage integer,
    participationPercentage integer,
    owner_id integer,
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(space_id),
    FOREIGN KEY(owner_id) REFERENCES users(user_id)
);

CREATE TABLE user_space (
    user_space_id uuid DEFAULT uuid_generate_v4 (),
    space_id integer,
    user_id integer,
    inivation_status: integer,
    deleted boolean,
    created_by integer,
    updated_by integer,
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(user_space_id),
    FOREIGN KEY(space_id) REFERENCES spaces(space_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(created_by) REFERENCES users(user_id),
    FOREIGN KEY(updated_by) REFERENCES users(user_id)
);


CREATE TABLE role_user_space (
    role_user_space_id uuid DEFAULT uuid_generate_v4 (),
    space_id integer,
    user_id integer,
    role varchar(10),
    deleted boolean,
    created_by integer,
    updated_by integer,
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(role_user_space_id),
    FOREIGN KEY(space_id) REFERENCES spaces(space_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(created_by) REFERENCES users(user_id),
    FOREIGN KEY(updated_by) REFERENCES users(user_id)
);