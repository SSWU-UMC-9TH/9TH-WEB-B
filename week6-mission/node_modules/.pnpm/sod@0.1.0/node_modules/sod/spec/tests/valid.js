 var sod = require('../../index.js');
 var R = require('ramda');
 describe("Sod Lib", function() {
    it('validGeometry: checks the object passed is a valid geometry.', function () {
        var geometry = {
                "type": "Point",
                "coordinates": [-105.01621,
                    39.57422
                ]
            },
            geometry2 = {
                "type": "point",
                "coordinates": [-105.01621,
                    39.57422
                ]
            };
        expect(sod.validGeometry(geometry)).toBe(true);
        expect(sod.validGeometry(geometry2)).toBe(false);
        expect(sod.validGeometry({})).toBe(false);
    });
    it('validGeoType: checks the type of a geometry is valid', function () {
        var geometry = {
                "type": "Point",
                "coordinates": [-105.01621,
                    39.57422
                ]
            },
            geometry2 = {
                "type": "point",
                "coordinates": [-105.01621,
                    39.57422
                ]
            };
        expect(sod.validGeoType(geometry)).toBe(true);
        expect(sod.validGeoType(geometry2)).toBe(false);
    });
    it('validGeoKeys: check a geometry keys are valid', function () {
        var geometry = sod.buildGeometry('Point',[-104.99404, 39.75621]),
            geometry2 = {
                coordinates: [-104.99404, 39.75621],
                type: 'Point'
            }
        expect(sod.validGeoKeys(geometry)).toBe(true);
        expect(sod.validGeoKeys(geometry2)).toBe(true);
    });

    it('is an Object', function () {
        expect(sod.isObject({type: 'noda'})).toBe(true);
        expect(sod.isObject(['nada'])).toBe(false);
        expect(sod.isObject('nada')).toBe(false);
        expect(sod.isObject(123)).toBe(false);
        expect(sod.isObject(-0.123)).toBe(false);
    });

     it("checks for valid geojson", function() {
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
         expect(sod.isValid(input)).toBe(true)
     });

    it('get the type', function () {
        var input = {
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
                 };
        expect(sod.getType(input)).toBe('Feature');
    });

    it('checks type returns true if it is that type', function () {
        var input = {
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
                 };
        expect(sod.isType('Feature',input)).toBe(true);
    });
 });
