var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/art_log';

//the root path, the /artists path
router.get('/', function(req, res) {
		pg.connect(connectionString, function(err, client, done) {
				if(err) {
					return console.error('error fetching client from pool', err);
				}
				client.query("select distinct on (artist.id) artist.id,name, years, url from work right outer join artist on artist.id = work.artist_id", function(err, result){
					if(err){
						client.end();
						console.log(err);
					} else {
						client.end();
						res.render('index', { title: 'Art', artists: result.rows});
					}
				});
		});
});     

//the random works path
router.get('/works/random', function(req, res) {
		pg.connect(connectionString, function(err, client, done) {
				if(err) {
					return console.error('error fetching client from pool', err);
				}
				client.query("select work.title, work.url, artist.name, work.artist_id, work.id from work join artist on artist.id = work.artist_id", function(err, result){
					if(err){
						client.end();
						console.log(err);
					} else {
						client.end();
						return res.json(result.rows);
					}
				});
		});
});     

// create a new artist
router.post('/artists/new', function(req, res) {
		var name = req.query.artist_name;
		var years = req.query.artist_years;
		if(!name) {
				name = null;
		} else {
				name = name.split(" ").map(function(ele){ return ele[0].toUpperCase() + ele.slice(1).toLowerCase() }).join(" ");
		}
		if(!years){
				years = "Unknown";
		}
		pg.connect(connectionString, function(err, client, done) {
				if (err) {
					return console.error('error fetching client from pool', err);
				}
				client.query("INSERT INTO artist(name, years) values($1, $2)", [name, years], function(err, result){
					if(err){
						res.status(400);
						res.send(err.toString());
						client.end();
						res.end();
					} else {
						client.query("SELECT * FROM artist where name = ($1)", [name], function(err, result){
							if(err){
								console.log(err);
								client.end();
							} else {
								client.end();
								return res.json(result.rows);
							}
						});
					}
				});
		});
});      

// create a new work
router.post('/artist/:id/works/new', function(req, res) {
		var title = req.query.title;
		var year = req.query.year;
		var url = req.query.url;
		var artist_id = req.query.artist_id;
		if(!url) {
				url = null;
		}
		if(!year){
				year = "Unknown";
		}
		if(!title){
				title = "Unknown";
		}
		pg.connect(connectionString, function(err, client, done) {
				if (err) {
					return console.error('error fetching client from pool', err);
				}
				client.query("INSERT INTO work(title, year, url, artist_id) values($1, $2, $3, $4)", [title, year, url, artist_id], function(err, result){
					if(err){
						res.status(400);
						res.send(err.toString());
						client.end();
						res.end();
					} else {
						client.query("SELECT * FROM work where url = ($1)", [url], function(error, result){
							if(error){
								console.log(error);
								client.end();
							} else {
								client.end(); 
								return res.json(result.rows);               
							}
						});
					}
				});
		});
});

//delete an artist
router.delete('/artist', function(req, res) {
	var id = req.query.id;
	pg.connect(connectionString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query("DELETE FROM work WHERE artist_id=($1)", [id], function(err, result) {
			if (err) {
				return console.error('error running query', err);
				client.end();
			} else {
				client.query("DELETE FROM artist WHERE id=($1)", [id], function(err, result) {
					if (err) {
						return console.error('error running query', err);
						client.end();
					} 
					client.end();
					res.end();
				});
			}
		});
	});
});

//delete a work
router.delete('/work', function(req, res) {
		var id = req.query.id;
		pg.connect(connectionString, function(err, client, done) { 
			if (err) {
				return console.error('error fetching client from pool', err);
			}
			client.query("DELETE FROM work WHERE id=($1)", [id], function(err, result) {
				if (err) {
					return console.error('error running query', err);
				}
				client.end();
				res.end();
		});
	});
});

// update a work
router.put('/work/:work_id', function(req, res) {
		var id = req.query.work_id;
		var title = req.query.work_title;
		var year = req.query.work_year;
		var url = req.query.work_url;
		if(!url) {
				url = null;
		}
		if(!year){
				year = "Unknown";
		}
		if(!title){
				title = "Unknown";
		}
		pg.connect(connectionString, function(err, client, done) {
			if (err) {
				return console.error('error fetching client from pool', err);
			}
			client.query("UPDATE work SET title=($1), year=($2), url=($3) WHERE id=($4)", [title, year, url, id], function(err, result){
				if(err){
					res.status(400);
					res.send(err.toString());
					client.end();
					res.end();
				} else {
					client.query("SELECT * FROM work where id = ($1)", [id], function(err, result){
						if(err){
							console.log(err);
							client.end();
						} else {
							client.end();
							return res.json(result.rows);
						}
					});
				}
			});
		});
});

// update an artist
router.put('/artist/:artist_id', function(req, res) {
		var id = req.query.artist_id;
		var name = req.query.artist_name;
		var years = req.query.artist_years;
		if(!name) {
				name = null;
		} else {
				name = name.split(" ").map(function(ele){ return ele[0].toUpperCase() + ele.slice(1).toLowerCase() }).join(" ");
		}
		if(!years){
				years = "Unknown";
		}
		pg.connect(connectionString, function(err, client, done) {
				if (err) {
					return console.error('error fetching client from pool', err);
				}
				client.query("UPDATE artist SET name=($1), years=($2) WHERE id=($3)", [name, years, id], function(err, result){
					if(err){
						res.status(400);
						res.send(err.toString());
						client.end();
						res.end();
					} else {
						client.query("SELECT * FROM artist where id = ($1)", [id], function(err, result){
							if(err){
								console.log(err);
								client.end();
							} else {
								client.end();
								return res.json(result.rows);
							}
						});
					}
				});
		});
});      

//show all an artist's works
router.get('/artist/:id', function(req, res, next) {
		var artist_id = req.params.id;
		pg.connect(connectionString, function(err, client, done) {
				if (err) {
					return console.error('error fetching client from pool', err);
				}
				client.query("select * from work where artist_id= ($1)", [artist_id], function(err, result){
					if(err){
						res.status(400);
						res.send(err.detail);
						client.end();
						res.end();
					} else {
						client.end();
						res.render('work', {layout: false, data: result.rows});
					}
				});
		});
});

module.exports = router;
