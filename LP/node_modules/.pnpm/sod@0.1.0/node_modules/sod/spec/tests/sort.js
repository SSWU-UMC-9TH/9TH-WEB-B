 var sod = require('../../index.js');
 var R = require('ramda');
 describe("Sod Lib", function() {

     it("sort features in featurecollection by lat/lng", function() {

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
                         "coordinates": [-15.01621,
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
                         "coordinates": [5.01621,
                             39.57422
                         ]
                     }
                 }

             ]
         };
         expect(
             JSON.stringify(
                 sod.sortByLatLng(input))
         ).toBe(
             JSON.stringify({
                 type: "FeatureCollection",
                 features: [{
                         "type": "Feature",
                         "properties": {
                             'letter': 'c'
                         },
                         "geometry": {
                             "type": "Point",
                             "coordinates": [5.01621,
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
                             "coordinates": [-15.01621,
                                 39.57422
                             ]
                         }
                     }, {
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
                     }

                 ]
             })
         )


     });
 });
