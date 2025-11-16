var sod = require('../../index.js');
var R = require('ramda');

describe("Sod Lib", function() {
    it("build convex", function() {
        var points = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [10.195312, 43.755225]
                }
            }, {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [10.404052, 43.8424511]
                }
            }, {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [10.579833, 43.659924]
                }
            }, {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [10.360107, 43.516688]
                }
            }, {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [10.14038, 43.588348]
                }
            }, {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [10.195312, 43.755225]
                }
            }]
        };
        // expect(JSON.stringify(sod.convex(points))).toBe(JSON.stringify({
        //     "type": "Feature",
        //     "geometry": {
        //         "type": "Polygon",
        //         "coordinates": [
        //             [
        //                 [10.360107, 43.516688],
        //                 [10.14038, 43.588348],
        //                 [10.195312, 43.755225],
        //                 [10.404052, 43.8424511],
        //                 [10.579833, 43.659924],
        //                 [10.360107, 43.516688]
        //             ]
        //         ]
        //     },
        //     "properties": {}
        // }));
    });
});
