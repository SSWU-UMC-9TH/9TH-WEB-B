 var sod = require('../../index.js');
 var R = require('ramda');
 describe("Sod Lib", function() {
     it("Explodes a polygon into a feature collection of points", function() {

         var input = {
             type: "FeatureCollection",
             features: [{
                     "type": "Feature",
                     "geometry": {
                         "type": "Polygon",
                         "coordinates": [
                             [
                                 [-109.05, 41.00],
                                 [-102.06, 40.99],
                                 [-102.03, 36.99],
                                 [-109.04, 36.99],
                                 [-109.05, 41.00]
                             ]
                         ]
                     },
                     "properties": {
                         "prop": "here"
                     }
                 }

             ]
         };
         expect(
             sod.explode(input)
         ).toEqual({
             type: "FeatureCollection",
             features: [{
                     "type": "Feature",
                     "geometry": {
                         "type": "Point",
                         "coordinates": [-109.05, 41.00]

                     },
                     "properties": {
                         "prop": "here"
                     }
                 }, {
                     "type": "Feature",
                     "geometry": {
                         "type": "Point",
                         "coordinates": [-102.06, 40.99],

                     },
                     "properties": {
                         "prop": "here"
                     }
                 }, {
                     "type": "Feature",
                     "geometry": {
                         "type": "Point",
                         "coordinates": [-102.03, 36.99]
                     },
                     "properties": {
                         "prop": "here"
                     }
                 }, {
                     "type": "Feature",
                     "geometry": {
                         "type": "Point",
                         "coordinates": [-109.04, 36.99]
                     },
                     "properties": {
                         "prop": "here"
                     }
                 }

             ]
         });

     });
 });
