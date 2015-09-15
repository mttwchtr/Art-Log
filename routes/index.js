var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/art_log';

//the root path, the /artists path
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

//the random works path
router.get('/works/random', function(req, res, next) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query("select work.title, work.url, artist.name, artist.id from work join artist on artist.id = work.artist_id");
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


// create a new artist
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

//create a new work
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

//delete an artist
router.delete('/artist', function(req, res) {
    var id = req.query.id;
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        client.query("DELETE FROM work WHERE artist_id=($1)", [id]);
        client.query("DELETE FROM artist WHERE id=($1)", [id]);
        var query = client.query("SELECT * FROM artist");
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

//delete a work
router.delete('/work', function(req, res) {
    var id = req.query.id;
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        client.query("DELETE FROM work WHERE id=($1)", [id]);
        var query = client.query("SELECT * FROM artist");
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

// update a work
router.put('/work/:work_id', function(req, res) {
    var results = [];
    var id = req.query.work_id;
    var title = req.query.work_title;
    var year = req.query.work_year;
    var url = req.query.work_url;
    pg.connect(connectionString, function(err, client, done) {
        client.query("UPDATE work SET title=($1), year=($2), url=($3) WHERE id=($4)", [title, year, url, id]);
        var query = client.query("SELECT * FROM work where id = ($1)", [id]);
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

// update an artist
router.put('/artist/:artist_id', function(req, res) {
    var results = [];
    var id = req.query.artist_id;
    var name = req.query.artist_name;
    var years = req.query.artist_years;
    pg.connect(connectionString, function(err, client, done) {
        client.query("UPDATE artist SET name=($1), years=($2) WHERE id=($3)", [name, years, id]);
        var query = client.query("SELECT * FROM artist where id = ($1)", [id]);
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

//show all an artist's works
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
            res.render('work', {layout: false, data: results});
        });
        if(err) {
          console.log(err);
        }
    });
});

module.exports = router;
