const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing post data that has json format//

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT, DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); next();
});

const { Pool } = require('pg');
const { features } = require('process');
const pool = new Pool({ user: 'postgres', host: 'localhost', database: 'lab4', password: 'a1234567', port: '5432'/* the port has to be a number*/ });

app.get('/api/get_markers', (req, res) => {
    pool.query("select * from tbl_markers;", (err, dbResponse) => {
        if (err) console.log(err); //console.log(dbResponse.rows); // here dbResponse is available, your data processing logic goes here
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(dbResponse.rows);
    }
    );
});

app.get('/api/get_markers_geojson', (req, res) => {
    pool.query("SELECT row_to_json (fc) FROM(SELECT 'FeatureCollection' As type , array_to_json (array_agg(f))As features FROM(SELECT 'Feature' As type , ST_AsGeoJSON (lg.geom) :: json As geometry, row_to_json ((SELECT l FROM (SELECT id , name ) As l)) As properties FROM tbl_markers As lg) As f) As fc;", (err, dbResponse) => {
        if (err) console.log(err); //console.log(dbResponse.rows); // here dbResponse is available, your data processing logic goes here
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(dbResponse.rows);
    }
    );
});

app.get('/api/get_closest_marker', (req, res) => {
    console.log(req.query);
    var lat = req.query.lat;
    var lon = req.query.lon;
    const q = `
                WITH tbl_line_to_closest_point AS (
                WITH query_point AS (
                SELECT ST_GeomFromText('POINT(${lon} ${lat})', 4326) AS geom
                )
                SELECT
                id,
                name,
                ST_Distance(ST_Transform(m.geom, 32633), ST_Transform(qp.geom, 32633)) AS distance,
                ST_MakeLine(m.geom, qp.geom) AS line_geom
                FROM
                tbl_markers m,
                query_point qp
                ORDER BY
                ST_Distance(ST_Transform(m.geom, 32633), ST_Transform(qp.geom, 32633))
                LIMIT 1
                )
                SELECT row_to_json(fc) FROM (
                SELECT
                    'FeatureCollection' AS type,
                    array_to_json(array_agg(f)) AS features
                FROM (
                    SELECT
                    'Feature' AS type,
                    ST_AsGeoJSON(lg.line_geom)::json AS geometry,
                    row_to_json((SELECT l FROM (SELECT id, name, distance) AS l)) AS properties
                    FROM tbl_line_to_closest_point AS lg
                ) AS f
                ) AS fc;
                `;
    //console.log(q);
    pool.query(q, (err, dbResponse) => {
        if (err) console.log(err);
        console.log(dbResponse.rows);
        res.send(dbResponse.rows);
    });

})

app.get('/api/get_buffer', (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const q = `WITH tbl_buffer_to_closest_point AS (
                WITH query_point AS (
                    SELECT ST_GeomFromText('POINT(${lon} ${lat})', 4326) AS geom
                )
                SELECT
                    id,
                    name,
                    ST_Distance(
                    ST_Transform(m.geom, 32633),
                    ST_Transform((qp.geom), 32633)
                    ) AS distance,
                    ST_Buffer(m.geom, 0.005) AS buffer_geom
                FROM tbl_markers m, query_point qp
                ORDER BY ST_Distance(
                    ST_Transform(m.geom, 32633),
                    ST_Transform(qp.geom, 32633)
                )
                LIMIT 1
                )
                SELECT row_to_json(fc) FROM (
                SELECT
                    'FeatureCollection' AS type,
                    array_to_json(array_agg(f)) AS features
                FROM (
                    SELECT
                    'Feature' AS type,
                    ST_AsGeoJSON(lg.buffer_geom)::json AS geometry,
                    row_to_json((SELECT l FROM (SELECT id, name, distance) AS l)) AS properties
                    FROM tbl_buffer_to_closest_point AS lg
                ) AS f
                ) AS fc;
                `
    pool.query(q, (err, dbResponse) => {
        if (err) console.log(err);
        console.log(dbResponse.rows);
        res.send(dbResponse.rows);
    });
})

app.post('/save_marker', (req, res) => {
    console.log('data received: ' + JSON.stringify(req.body)); // data you send from your application is available on req.body object, your data processing logic goes here
    const q = 'INSERT INTO tbl_markers(name, geom) VALUES($1, ST_GeomFromText($2, 4326))';
    const values = [req.body.name, `POINT(${req.body.lon} ${req.body.lat})`];
    /* var q = "insert into tbl_markers(name,geom) values ( " + "'" +
        req.body.name + "', ST_GeomFromText('POINT(" + req.body.lon +
        " " + req.body.lat + ")',4326));"; */
    //"insert into tbl_markers(name,geom) values ( 'req.body.name', ST_GeomFromText('POINT( req.body.lon  req.body.lat )',4326));"
    pool.query(q, values, (err, dbResponse) => {
        if (err) {
            console.error('Error executing query', err.stack);
            res.status(500).send('An error occurred: ' + err.message);
        };
        res.send(dbResponse.rows);
    });
});


app.get('/lab4', (req, res) => res.sendFile(__dirname + '/lab4.html'))


app.listen(3000, () => console.log('Example app listening on http://localhost:3000'));

