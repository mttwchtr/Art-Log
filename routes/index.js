var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/art_log';

router.post('/artists/new', function(req, res) {
    var results = [];
    var name = req.query.artist_name;
    var years = req.query.artist_years;
    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO artist(name, years) values($1, $2)", [name, years]);
        var query = client.query("SELECT * FROM artist where name = ($1)", [name]);
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            client.end();
            return res.json(results);
        });
        if(err) {
          console.log(err);
        }
    });
});

router.post('/artist/:id/new', function(req, res) {
    var results = [];
    var title = req.query.title;
    var year = req.query.year;
    var url = req.query.url;
    var artist_id = req.query.artist_id;
    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO work(title, year, url, artist_id) values($1, $2, $3, $4)", [title, year, url, artist_id]);
        var query = client.query("SELECT * FROM work where title = ($1)", [title]);
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            client.end();
            return res.json(results);
        });
        if(err) {
          console.log(err);
        }
    });
});

router.get('/', function(req, res, next) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query("select distinct on (artist.id) artist.id,name, years, url from work right outer join artist on artist.id = work.artist_id");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            client.end();
            res.render('index', { title: 'Express', artists: results});
        });
        if(err) {
          console.log(err);
        }
    });
});

router.get('/artist/:id', function(req, res, next) {
    var artist_id = req.params.id;
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query("select * from work where artist_id= ($1)", [artist_id]);
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            client.end();
            return res.json(results);
        });
        if(err) {
          console.log(err);
        }
    });
});

module.exports = router;
