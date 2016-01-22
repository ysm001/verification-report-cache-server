'use strict';

const mongoose = require('mongoose');
const fs = require('fs');
const Svgo = require('svgo');
const yaml = require('js-yaml');
const svgoConfig = yaml.safeLoad(fs.readFileSync('./config/svgo.yml', 'utf8'));
const svgo = new Svgo(svgoConfig);

const SvgSchema = new mongoose.Schema({
  chartId: { type: String },
  svg: { type: String },
  source: { type: String }
}, {
  timestamps: true
});

SvgSchema.static('findByChartId', function(chartId) {
  return this 
    .where({chartId: chartId})
    .then((results) => {
      return results[0];
    });
});

SvgSchema.static('findByDataId', function(dataId) {
  return this.find({chartId: new RegExp(`.*${dataId}$`)});
});

SvgSchema.static('saveOrUpdate', function(params) {
  return this.optimize(params).then((optimizedParams) => {
    return this.findOneAndUpdate({
      chartId: params.id,
    }, optimizedParams, {
      new: true,
      upsert: true
    }).exec();
  })
});

SvgSchema.static('optimize', function(params) {
  return new Promise((resolve) => {
    svgo.optimize(params.svg, (result) => {
      console.log(`cache compression: ${params.svg.length / 1024}KB -> ${result.data.length / 1024}KB (${result.data.length * 100.0 / params.svg.length}%)`);
      return resolve({
        svg: result.data,
        source: params.source,
        id: params.chartId
      });
    });
  });
});

module.exports = mongoose.model('Svg', SvgSchema);
