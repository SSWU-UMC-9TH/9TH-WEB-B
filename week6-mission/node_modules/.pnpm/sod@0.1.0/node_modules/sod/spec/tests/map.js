var sod = require('../../index.js');
var R = require('ramda');
describe("Sod Lib", function() {

    it("map over features in feature collection", function() {
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
                sod.map(function(obj) {
                    obj.properties.newProp = 'new';
                    return obj;

                }, input))
        ).toBe(
            JSON.stringify({
                type: "FeatureCollection",
                features: [{
                        "type": "Feature",
                        "properties": {
                            'letter': 'a',
                            'newProp': 'new'
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
                            'letter': 'b',
                            'newProp': 'new'
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
                            'letter': 'c',
                            'newProp': 'new'
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [-105.01621,
                                39.57422
                            ]
                        }
                    }

                ]
            }   )
        )


    });
});
