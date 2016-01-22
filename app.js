'use strict';

const fs = require('fs');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const config = require('./config/server.js');
const db = require('./config/db.js');
const Svg = require('./models/svg.js');
const Svgo = require('svgo');
const bodyParser = require('body-parser');
const corser = require('corser');

app.use(bodyParser.json({limit: '50mb'}));

app.use(corser.create({
  methods: corser.simpleMethods.concat(['PUT', 'DELETE']),
  requestHeaders: corser.simpleRequestHeaders.concat(["X-Requested-With"])
}));

app.get('/svgs/cache', (req, res) => {
  Svg.findByChartId(req.query.id).then((result) => {
    console.log(`cache found: ${result.chartId}`);

    res.send({
      id: result.chartId,
      svg: result.svg,
      source: result.source
    });
  }).onReject((err) => {
    res.send(err);
  });
});

app.post('/svgs/cache', (req, res) => {
  Svg.saveOrUpdate(req.body).then(() => {
    console.log(`cached: ${req.body.id}`);
    res.send({result: true});
  }).catch((err) => {
    console.log(err.stack);
    res.send({result: false, error: err});
  });
});

app.get('/svgs/:dataId/ids', (req, res) => {
  Svg.findByDataId(req.params.dataId).then((results) => {
    res.send(results.map((result) => {return result.chartId}));
  }).onReject((err) => {
    res.send(err);
  });
});

app.get('/svgs/:chartId', (req, res) => {
  Svg.findByChartId(req.params.chartId).then((result) => {
    res.send(result.svg);
  }).onReject((err) => {
    res.send(err);
  });
});

server.listen(config.port);
console.log(`listen: ${config.port}`);
