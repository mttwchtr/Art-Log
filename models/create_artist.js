var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/art_log';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE artist(id SERIAL PRIMARY KEY, name VARCHAR(40) not null unique, years VARCHAR(40))');
query.on('end', function() { client.end(); });