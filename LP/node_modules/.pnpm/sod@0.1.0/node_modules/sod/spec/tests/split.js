var sod = require('../../index.js');
var R = require('ramda');
describe("Sod Lib", function() {
    it("split feature collection on key", function() {
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
                sod.split('letter', input))
        ).toBe(
            JSON.stringify({
                a: [{
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
                }],
                b: [{
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
                }],
                c: [{
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
                }]
            })
        )

    });
});
