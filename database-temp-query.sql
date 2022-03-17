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

CREATE TABLE cache (
    cache_id uuid DEFAULT uuid_generate_v4 (),
    user_id uuid  NOT NULL,
    entity_name varchar(255),
    event_name varchar(255),
    data text,
    created_at timestamp not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(cache_id)
);


CREATE TABLE manifesto (
    manifesto_id uuid DEFAULT uuid_generate_v4 (),
    title varchar(255),
    content text,
    option_type integer not null,
    space_id uuid not null,
    created_by uuid not null,
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_by uuid not null,
    updated_at timestamp not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(manifesto_id),
    FOREIGN KEY(space_id) REFERENCES spaces(space_id),
    FOREIGN KEY(created_by) REFERENCES users(user_id),
    FOREIGN KEY(updated_by) REFERENCES users(user_id)
);

CREATE TRIGGER set_timestamp_manifesto
BEFORE UPDATE ON manifesto
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


CREATE TABLE manifesto_option (
    manifesto_option_id uuid DEFAULT uuid_generate_v4 (),
    title varchar(255) not null,
    manifesto_id uuid not null,
    deleted boolean DEFAULT false,
    created_by uuid not null,
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_by uuid not null,
    updated_at timestamp not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(manifesto_option_id),
    FOREIGN KEY(manifesto_id) REFERENCES manifesto(manifesto_id),
    FOREIGN KEY(created_by) REFERENCES users(user_id),
    FOREIGN KEY(updated_by) REFERENCES users(user_id)
);

CREATE TRIGGER set_timestamp_manifesto_option
BEFORE UPDATE ON manifesto_option
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE proposal (
    proposal_id uuid DEFAULT uuid_generate_v4 (),
    manifesto_id uuid not null,
    status integer not null,
    progress_status integer not null default 0,
    space_id uuid not null,
    expired_at timestamp,
    created_by uuid not null,
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_by uuid not null,
    updated_at timestamp not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(proposal_id),
    FOREIGN KEY(manifesto_id) REFERENCES manifesto(manifesto_id),
    FOREIGN KEY(created_by) REFERENCES users(user_id),
    FOREIGN KEY(updated_by) REFERENCES users(user_id)
);

CREATE TRIGGER set_timestamp_proposal
BEFORE UPDATE ON proposal
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


CREATE TABLE proposal_participation (
    proposal_participation_id uuid DEFAULT uuid_generate_v4 (),
    proposal_id uuid not null,
    user_id uuid not null,
    member_id uuid not null,
    participated boolean default false,
	PRIMARY KEY(proposal_participation_id),
    FOREIGN KEY(proposal_id) REFERENCES proposal(proposal_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(member_id) REFERENCES members(member_id),
);


CREATE TABLE proposal_vote (
    proposal_vote_id uuid DEFAULT uuid_generate_v4 (),
    proposal_id uuid not null,
    user_hash varchar(255) not null,
    manifesto_option_id uuid,
    in_favor boolean,
    null_vote_comment text,
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(proposal_vote_id),
    FOREIGN KEY(proposal_id) REFERENCES proposal(proposal_id),
    FOREIGN KEY(manifesto_option_id) REFERENCES manifesto_option(manifesto_option_id)
);

CREATE TRIGGER set_timestamp_proposal_vote
BEFORE UPDATE ON proposal_vote
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();