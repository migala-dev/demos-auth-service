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

CREATE TABLE members (
    member_id uuid DEFAULT uuid_generate_v4 (),
    space_id uuid not null,
    user_id uuid not null,
    invitation_status integer,
    role varchar(30) not null,
    name varchar(255),
    expired_at timestamp,
    deleted boolean DEFAULT false,
    created_by uuid not null,
    updated_by uuid not null,
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(members_id),
    FOREIGN KEY(space_id) REFERENCES spaces(space_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(created_by) REFERENCES users(user_id),
    FOREIGN KEY(updated_by) REFERENCES users(user_id)
);

CREATE TRIGGER set_timestamp_members
BEFORE UPDATE ON members
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
