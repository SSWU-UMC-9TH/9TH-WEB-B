var sod = require('../../index.js');
var R = require('ramda');
describe("Sod Lib", function() {
    it("filter feature collection", function() {
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
            sod.filter(sod.propertyEqualTo('letter', 'a'), input)
        ).toEqual({
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
            }]
        })


    });
    it("removes featues with matching properties from feature collection", function() {
        var input = {
            type: "FeatureCollection",
            features: [{
                    "type": "Feature",
                    "properties": {
                        'letter': ['a', 'z']
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
                sod.remove(sod.propertyEqualTo('letter', 'b'), input))
        ).toBe(
            JSON.stringify({
                type: "FeatureCollection",
                features: [{
                        "type": "Feature",
                        "properties": {
                            'letter': ['a', 'z']
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
            })
        )


    });
    it("filter feature collection", function() {
        var input = {
            type: "FeatureCollection",
            features: [{
                    "type": "Feature",
                    "properties": {
                        'letter': ['a', 'z']
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
          
                sod.filter(sod.propertyEqualTo('letter', 'a'), input)
        ).toEqual(
            {
                type: "FeatureCollection",
                features: [{
                    "type": "Feature",
                    "properties": {
                        'letter': ['a', 'z']
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-105.01621,
                            39.57422
                        ]
                    }
                }]
            }
        )


    });

});
