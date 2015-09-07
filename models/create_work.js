var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/art_log';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE work(id SERIAL PRIMARY KEY, artist_id integer REFERENCES artist (id), year VARCHAR(40), url VARCHAR(200), title VARCHAR(200))');
query.on('end', function() { client.end(); });