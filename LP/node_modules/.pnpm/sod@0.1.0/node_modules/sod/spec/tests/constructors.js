var sod = require('../../index.js');
var R = require('ramda');

describe("Sod constructors: ", function() {
    it('toFeature: creates feature object', function () {
        var type = 'Point',
            coordinates = [-104.99404, 39.75621],
            properties = {
                "name": "Coors Field",
                "amenity": "Baseball Stadium",
                "popupContent": "This is where the Rockies play!"
            };
        expect(JSON.stringify(sod.toFeature(type,coordinates,properties))).toBe(JSON.stringify({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-104.99404, 39.75621]
            },
            "properties": {
                "name": "Coors Field",
                "amenity": "Baseball Stadium",
                "popupContent": "This is where the Rockies play!"
            }
        }))
    });
    it('buildGeometry - creates geometry object', function () {
        expect(JSON.stringify(sod.buildGeometry('Point',[-105.01621, 39.57422]))).toBe(JSON.stringify({
                "type": "Point",
                "coordinates": [-105.01621,
                    39.57422
                ]
            }))
    });
    it('buildFeaure - creates Feature Object', function () {
        var geometry = sod.buildGeometry('Point',[-104.99404, 39.75621]),
            properties = {
                "name": "Coors Field",
                "amenity": "Baseball Stadium",
                "popupContent": "This is where the Rockies play!"
            };
        expect(JSON.stringify(sod.buildFeature(properties, geometry))).toBe(JSON.stringify({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-104.99404, 39.75621]
                },
                "properties": {
                    "name": "Coors Field",
                    "amenity": "Baseball Stadium",
                    "popupContent": "This is where the Rockies play!"
                }
            })
        );
    });

    it("buildFeatureCollection - create feature collection", function() {
        var fc = sod.featurecollection([{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [-105.01621,
                    39.57422
                ]
            }
        }]);
        expect(JSON.stringify(fc)).toBe(JSON.stringify({
            type: "FeatureCollection",
            features: [{
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [-105.01621,
                        39.57422
                    ]
                }
            }]
        }));
    });

    it("create polygon", function() {
        var poly = sod.polygon([
            [
                [-109.05, 41.00],
                [-102.06, 40.99],
                [-102.03, 36.99],
                [-109.04, 36.99],
                [-109.05, 41.00]
            ]
        ], {
            "prop": "here"
        });

        expect(JSON.stringify(poly)).toBe(JSON.stringify({
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
        }));
    });
});
