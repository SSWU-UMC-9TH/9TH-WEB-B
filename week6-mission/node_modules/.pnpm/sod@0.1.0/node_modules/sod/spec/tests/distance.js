var sod = require('../../index.js');
var R = require('ramda');

describe("Sod Lib", function () {
    it("Calculates the distance in meters between two point feature", function () {
        var point1 = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [-75.343, 39.984]
            }
        };
        var point2 = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [-75.534, 39.123]
            }
        };
        expect(
            sod.distance(point1, point2)
        ).toEqual(97160);
    });
});
