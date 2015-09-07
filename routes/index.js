var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/art_log';

router.get('/', function(req, res, next) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query("select distinct on (artist_id) artist_id,name, years, url from work left join artist on artist.id = work.artist_id");
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
