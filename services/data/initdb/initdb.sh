#!/bin/bash

psql -U "$POSTGRES_USER" <<-EOSQL
    create user safe1admin with password 'securepassword';
    create database safe1;
    \c safe1;
    create extension if not exists "uuid-ossp";
    grant all privileges on database safe1 to safe1admin;
EOSQL