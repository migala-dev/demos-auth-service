CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE spaces (
    space_id uuid DEFAULT uuid_generate_v4 (),
    name varchar(255) not null,
    description varchar(255),
    picture_key varchar(255),
    approval_percentage integer not null,
    participation_percentage integer not null,
    owner_id uuid not null,
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(space_id),
    FOREIGN KEY(owner_id) REFERENCES users(user_id)
);

CREATE TRIGGER set_timestamp_spaces
BEFORE UPDATE ON spaces
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE user_space (
    user_space_id uuid DEFAULT uuid_generate_v4 (),
    space_id uuid not null,
    user_id uuid not null,
    invitation_status integer,
    deleted boolean DEFAULT false,
    created_by uuid not null,
    updated_by uuid not null,
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(user_space_id),
    FOREIGN KEY(space_id) REFERENCES spaces(space_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(created_by) REFERENCES users(user_id),
    FOREIGN KEY(updated_by) REFERENCES users(user_id)
);

CREATE TRIGGER set_timestamp_user_space
BEFORE UPDATE ON user_space
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE role_user_space (
    role_user_space_id uuid DEFAULT uuid_generate_v4 (),
    space_id uuid NOT NULL,
    user_id uuid  NOT NULL,
    role varchar(10),
    deleted boolean DEFAULT false,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(role_user_space_id),
    FOREIGN KEY(space_id) REFERENCES spaces(space_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(created_by) REFERENCES users(user_id),
    FOREIGN KEY(updated_by) REFERENCES users(user_id)
);

CREATE TRIGGER set_timestamp_role_user_space
BEFORE UPDATE ON role_user_space
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE cache (
    cache_id uuid DEFAULT uuid_generate_v4 (),
    user_id uuid  NOT NULL,
    entity_name varchar(255),
    event_name varchar(255),
    data varchar(MAX),
    created_at timestamp not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(cache_id)
);

