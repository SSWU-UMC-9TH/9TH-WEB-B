var sod = require('../../index.js');
var R = require('ramda');

describe("Sod Lib", function() {
    it("Creates voroni feature collection from feature collection", function() {
        var input = {
            "type": "FeatureCollection",
            "features": [{
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
        expect(sod.voroni(input)).toEqual({
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [-180, -60.01621],
                        [180, -60.01621],
                        [180, -90],
                        [-180, -90],
                        [-180, -60.01621]
                    ]
                },
                "properties": {
                    "letter": "a"
                }
            }, {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [-180, -5],
                        [180, -5],
                        [180, -60.01621],
                        [-180, -60.01621],
                        [-180, -5]
                    ]
                },
                "properties": {
                    "letter": "b"
                }
            }, {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [180, -5],
                        [-180, -5],
                        [-180, 90],
                        [180, 90],
                        [180, -5]
                    ]
                },
                "properties": {
                    "letter": "c"
                }
            }]
        })
    });
});
