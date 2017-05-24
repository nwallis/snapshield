var productSequence;

var validSequenceJSON, validSequenceJSONStartingOnLastImage;

describe("Product videos", function() {

    beforeEach(function() {
        validSequenceJSON = {
            "startingLevel": 1,
            "startingImage": 5,
            "prefix": "cube",
            "levels": 3,
            "images": 10,
            "horizontalLoop": true,
            "verticalLoop": false,
            "hotspotDictionary": [{
                "cube-info-1": {
                    "type": "bubble",
                },
                "cube-info-2": {
                    "type": "sound",
                    "url": "http://localhost.snapshield/audio/cube-info-2"
                }
            }],
            "hotspotLocations": {
                "cube-0-9": [{
                    "x": .3,
                    "y": .3,
                    "hotspot": "cube-info-1"
                }, {
                    "x": .9,
                    "y": .9,
                    "hotspot": "cube-info-2"
                }]
            }
        };

        validSequenceJSONStartingOnFirstImage = {
            "startingLevel": 1,
            "startingImage": 1,
            "prefix": "cube",
            "levels": 3,
            "images": 10,
            "horizontalLoop": true,
            "verticalLoop": false,
            "hotspotDictionary": [{
                "cube-info-1": {
                    "type": "bubble",
                },
                "cube-info-2": {
                    "type": "sound",
                    "url": "http://localhost.snapshield/audio/cube-info-2"
                }
            }],
            "hotspotLocations": {
                "cube-0-9": [{
                    "x": .3,
                    "y": .3,
                    "hotspot": "cube-info-1"
                }, {
                    "x": .9,
                    "y": .9,
                    "hotspot": "cube-info-2"
                }]
            }
        };

        validSequenceJSONStartingOnLastImage = {
            "startingLevel": 3,
            "startingImage": 10,
            "prefix": "cube",
            "levels": 3,
            "images": 10,
            "horizontalLoop": true,
            "verticalLoop": false,
            "hotspotDictionary": [{
                "cube-info-1": {
                    "type": "bubble",
                },
                "cube-info-2": {
                    "type": "sound",
                    "url": "http://localhost.snapshield/audio/cube-info-2"
                }
            }],
            "hotspotLocations": {
                "cube-0-9": [{
                    "x": .3,
                    "y": .3,
                    "hotspot": "cube-info-1"
                }, {
                    "x": .9,
                    "y": .9,
                    "hotspot": "cube-info-2"
                }]
            }
        };

        productSequence = new Product(validSequenceJSON);
        productSequenceStartingOnLastImage = new Product(validSequenceJSONStartingOnLastImage);
        productSequenceStartingOnFirstImage = new Product(validSequenceJSONStartingOnFirstImage);

    });

    it("should throw an error if no JSON is parsed to constructor", function() {
        expect(function() {
            new Product();
        }).toThrow();
    });

    it("should be able to start at any image in the sequence", function() {
        expect(productSequence.getCurrentImage()).toEqual('cube-1-5');
    });

    //Horizontal progress
    it("should adjust the image when movement is detected horizontally in a negative direction", function() {
        var numberOfImagesToMoveNegatively = -2;
        var moveThreshold = 50;
        productSequence.setThreshold(moveThreshold);
        productSequence.move(0, numberOfImagesToMoveNegatively * moveThreshold);
        expect(productSequence.getCurrentImage()).toEqual('cube-1-3');
    });

    it("if horizontal loop is enabled, moving negatively should cycle ", function() {
        var numberOfImagesToMoveNegatively = -16;
        var moveThreshold = 50;
        productSequence.setThreshold(moveThreshold);
        productSequence.move(0, numberOfImagesToMoveNegatively * moveThreshold);
        expect(productSequence.getCurrentImage()).toEqual('cube-1-9');
    });

    it("if horizontal loop is enabled, moving positively should cycle ", function() {
        var numberOfImagesToMovePositively = 7;
        var moveThreshold = 50;
        productSequence.setThreshold(moveThreshold);
        productSequence.move(0, numberOfImagesToMovePositively * moveThreshold);
        expect(productSequence.getCurrentImage()).toEqual('cube-1-2');
    });

    it("if horizontal loop is not enabled, moving negatively should not go past first image", function() {
        var numberOfImagesToMoveNegatively = -10;
        var moveThreshold = 50;
        productSequence.sequenceData.horizontalLoop = false;
        productSequence.setThreshold(moveThreshold);
        productSequence.move(0, numberOfImagesToMoveNegatively * moveThreshold);
        expect(productSequence.getCurrentImage()).toEqual('cube-1-1');
    });


    it("if horizontal loop is not enabled, moving positively should not go past last image", function() {
        var numberOfImagesToMovePositively = 20;
        var moveThreshold = 50;
        productSequence.sequenceData.horizontalLoop = false;
        productSequence.setThreshold(moveThreshold);
        productSequence.move(0, numberOfImagesToMovePositively * moveThreshold);
        expect(productSequence.getCurrentImage()).toEqual('cube-1-10');
    });

    it("if horizontal loop is enabled, moving negatively and cycling backwards should take you to the last image", function() {
        var numberOfImagesToMoveNegatively = -1;
        var moveThreshold = 50;
        productSequenceStartingOnFirstImage.setThreshold(moveThreshold);
        productSequenceStartingOnFirstImage.move(0, numberOfImagesToMoveNegatively * moveThreshold);
        expect(productSequenceStartingOnFirstImage.getCurrentImage()).toEqual('cube-1-10');
    });

    it("if horizontal loop is enabled, moving positively and cycling to the end should take you back to the first image", function() {
        var numberOfImagesToMovePositively = 1;
        var moveThreshold = 50;
        productSequenceStartingOnLastImage.setThreshold(moveThreshold);
        productSequenceStartingOnLastImage.move(0, numberOfImagesToMovePositively * moveThreshold);
        expect(productSequenceStartingOnLastImage.getCurrentImage()).toEqual('cube-3-1');
    });


    //Vertical progress

    it("if vertical loop is enabled, moving negatively and cycling backwards should take you to the last image", function() {
        var numberOfImagesToMoveNegatively = -1;
        var moveThreshold = 50;
        productSequenceStartingOnFirstImage.sequenceData.verticalLoop = true;
        productSequenceStartingOnFirstImage.setThreshold(moveThreshold);
        productSequenceStartingOnFirstImage.move(numberOfImagesToMoveNegatively * moveThreshold, 0);
        expect(productSequenceStartingOnFirstImage.getCurrentImage()).toEqual('cube-3-1');
    });

    it("if vertical loop is enabled, moving positively and cycling to the end should take you back to the first image", function() {
        var numberOfImagesToMovePositively = 1;
        var moveThreshold = 50;
        productSequenceStartingOnLastImage.setThreshold(moveThreshold);
        productSequenceStartingOnLastImage.sequenceData.verticalLoop = true;
        productSequenceStartingOnLastImage.move(numberOfImagesToMovePositively * moveThreshold, 0);
        expect(productSequenceStartingOnLastImage.getCurrentImage()).toEqual('cube-1-10');
    });

    it("if vertical loop is enabled, moving negatively should cycle ", function() { 
        var numberOfImagesToMoveNegatively = -5;
        var moveThreshold = 50;
        productSequence.setThreshold(moveThreshold);
        productSequence.sequenceData.verticalLoop = true;
        productSequence.move(numberOfImagesToMoveNegatively * moveThreshold, 0);
        expect(productSequence.getCurrentImage()).toEqual('cube-2-5');
    });

    it("if vertical loop is enabled, moving positively should cycle ", function() {
        var numberOfImagesToMovePositively = 7;
        var moveThreshold = 50;
        productSequence.setThreshold(moveThreshold);
        productSequence.sequenceData.verticalLoop = true;
        productSequence.move(numberOfImagesToMovePositively * moveThreshold, 0);
        expect(productSequence.getCurrentImage()).toEqual('cube-2-5');
    });

    it("if vertical loop is not enabled, moving negatively should not go past first image", function() {
        var numberOfImagesToMoveNegatively = -10;
        var moveThreshold = 50;
        productSequence.setThreshold(moveThreshold);
        productSequence.move(numberOfImagesToMoveNegatively * moveThreshold, 0);
        expect(productSequence.getCurrentImage()).toEqual('cube-1-5');
    });

    it("if vertical loop is not enabled, moving positively should not go past last image", function() {
        var numberOfImagesToMovePositively = 20;
        var moveThreshold = 50;
        productSequence.setThreshold(moveThreshold);
        productSequence.move(numberOfImagesToMovePositively * moveThreshold, 0);
        expect(productSequence.getCurrentImage()).toEqual('cube-3-5');
    });

});

describe( "App level testing", function(){
   it ("should throw an error if there is no UserController instance passed to its constructor", function(){
        expect(function() {
            new Shield();
        }).toThrow();
   }); 
});
