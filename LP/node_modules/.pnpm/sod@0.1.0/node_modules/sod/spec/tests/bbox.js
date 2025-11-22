 var sod = require('../../index.js');
 var R = require('ramda');
 describe("Sod Lib", function () {
     // bbox = min Longitude , min Latitude , max Longitude , max Latitude 
     it("Calculates bounding box for features", function () {

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
                 }, {
                     "type": "Feature",
                     "properties": {
                         'letter': 'a'
                     },
                     "geometry": {
                         "type": "Point",
                         "coordinates": [-105.01621,
                             69.57422
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
                 sod.bbox(input))
         ).toBe(
             JSON.stringify([-109.05, 36.99, 5.01621, 69.57422])
         );

     });
     it("Adds bbox to feature collection", function () {

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
                 }, {
                     "type": "Feature",
                     "properties": {
                         'letter': 'a'
                     },
                     "geometry": {
                         "type": "Point",
                         "coordinates": [-105.01621,
                             69.57422
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
                 sod.appendBbox(input))
         ).toBe(
             JSON.stringify({
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
                         }, {
                             "type": "Feature",
                             "properties": {
                                 'letter': 'a'
                             },
                             "geometry": {
                                 "type": "Point",
                                 "coordinates": [-105.01621,
                                     69.57422
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

                     ],
                     bbox: [-109.05, 36.99, 5.01621, 69.57422]
                 }
             )
         );

     });
     it("Bounding box on Dateline", function () {
         var input = {
             "type": "FeatureCollection",
             "features": [{
                 "type": "Feature",
                 "properties": {},
                 "geometry": {
                     "type": "Point",
                     "coordinates": [-180,
                         0
                     ]
                 }
             }, {
                 "type": "Feature",
                 "properties": {},
                 "geometry": {
                     "type": "Point",
                     "coordinates": [176, 4]
                 }
             }, {
                 "type": "Feature",
                 "properties": {},
                 "geometry": {
                     "type": "Point",
                     "coordinates": [-180,
                         3
                     ]
                 }
             }, {
                 "type": "Feature",
                 "properties": {},
                 "geometry": {
                     "type": "Point",
                     "coordinates": [-177,
                         7.1
                     ]
                 }
             }, {
                 "type": "Feature",
                 "properties": {},
                 "geometry": {
                     "type": "Point",
                     "coordinates": [-174, -0.5]
                 }
             }, {
                 "type": "Feature",
                 "properties": {},
                 "geometry": {
                     "type": "Point",
                     "coordinates": [-178, -3.7]
                 }
             }, {
                 "type": "Feature",
                 "properties": {},
                 "geometry": {
                     "type": "Point",
                     "coordinates": [-175.75, -4.75]
                 }
             }, {
                 "type": "Feature",
                 "properties": {},
                 "geometry": {
                     "type": "Point",
                     "coordinates": [-172.25,
                         1.75
                     ]
                 }
             }, {
                 "type": "Feature",
                 "properties": {},
                 "geometry": {
                     "type": "Point",
                     "coordinates": [-172,
                         8.2
                     ]
                 }
             }]
         };
         expect(
             JSON.stringify(
                 sod.bbox(input))
         ).toBe(
             JSON.stringify([-180,-4.75,176,8.2])
         );

     });
 });
