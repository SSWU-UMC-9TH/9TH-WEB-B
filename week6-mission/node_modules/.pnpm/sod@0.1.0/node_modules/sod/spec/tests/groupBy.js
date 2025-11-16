 var sod = require('../../index.js');
 var R = require('ramda');
 describe("Sod Lib", function() {

     it("Merge features with the same lat/lng into one with features property", function() {

         var input = {
             type: "FeatureCollection",
             features: [{
                     "type": "Feature",
                     "properties": {
                         'letter': 'a'
                     },
                     "geometry": {
                         "type": "Point",
                         "coordinates": [-105.01621,
                             39.57422
                         ]
                     }
                 }, {
                     "type": "Feature",
                     "properties": {
                         'letter': 'b'
                     },
                     "geometry": {
                         "type": "Point",
                         "coordinates": [-105.01621,
                             39.57422
                         ]
                     }
                 }, {
                     "type": "Feature",
                     "properties": {
                         'letter': 'c'
                     },
                     "geometry": {
                         "type": "Point",
                         "coordinates": [-105.01621,
                             39.57422
                         ]
                     }
                 }

             ]
         };
         expect(
             JSON.stringify(
                 sod.merge(input)
             )).toBe(
             JSON.stringify({
                 type: "FeatureCollection",
                 features: [{
                         "type": "Feature",

                         "geometry": {
                             "type": "Point",
                             "coordinates": [-105.01621,
                                 39.57422
                             ]
                         },
                         "properties": {
                             'features': [{
                                 'letter': 'a'
                             }, {
                                 'letter': 'b'
                             }, {
                                 'letter': 'c'
                             }]
                         }
                     }

                 ]
             })
         )


     });
 });
