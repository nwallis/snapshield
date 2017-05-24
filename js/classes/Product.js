var Product = function(sequenceData) {

    if (sequenceData == undefined) throw new Error(Product.errorLookup("SNP0000"));

    try {
        JSON.stringify(sequenceData);
    } catch (error) {
        throw new Error(Product.errorLookup("SNP0001"));
    }

    //Don't store this, create instance variables
    this.sequenceData = sequenceData;

    this.levels = [];
    this.currentImage = this.sequenceData.startingImage;
    this.currentLevel = this.sequenceData.startingLevel;
    this.setThreshold(100);
}

Product.prototype.preload = function() {}

Product.prototype.setThreshold = function(value) {
    this.horizontalThreshold = this.verticalThreshold = value;
}

Product.prototype.setVerticalThreshold = function(value) {
    this.verticalThreshold = value;
}

Product.prototype.setHorizontalThreshold = function(value) {
    this.horizontalThreshold = value;
}

Product.prototype.move = function(verticalMoveAmount, horizontalMoveAmount) {

    var horizontalSteps = (Product.numberCeiling(horizontalMoveAmount / this.horizontalThreshold));
    var verticalSteps = (Product.numberCeiling(verticalMoveAmount / this.verticalThreshold));

    if (this.sequenceData.horizontalLoop) {
        horizontalSteps %= this.sequenceData.images;
        this.currentImage = ((this.currentImage + this.sequenceData.images) + horizontalSteps) % this.sequenceData.images;
        if (this.currentImage == 0) this.currentImage = this.sequenceData.images;
    } else {
        this.currentImage = Math.min(Math.max(this.currentImage + horizontalSteps, 1), this.sequenceData.images);
    }

    if (this.sequenceData.verticalLoop) {
        verticalSteps %= this.sequenceData.levels;
        this.currentLevel = ((this.currentLevel + this.sequenceData.levels) + verticalSteps) % this.sequenceData.levels;
        if (this.currentLevel == 0) this.currentLevel = this.sequenceData.levels;
    } else {
        this.currentLevel = Math.min(Math.max(this.currentLevel + verticalSteps, 1), this.sequenceData.levels);
    }

    //Render hotspots
    this.displayCurrentHotspots();
}

Product.prototype.displayCurrentHotspots = function() {

    //Clear old hotspots
    $("#hotspot-container").empty();

    var hotspots = this.getCurrentHotspots();
    var self = this;

    if (hotspots) {
        hotspots.forEach(function(individualHotspot) {
            var hotspotData = self.sequenceData.hotspotDictionary[individualHotspot.hotspotName];
            var hotspotVisual = new Hotspot(hotspotData);
            $("#hotspot-container").append(hotspotVisual.toHTML());
        });
    }

}

Product.numberCeiling = function(value) {
    return (value >= 0) ? Math.ceil(value) : Math.floor(value);
}

Product.prototype.setFactors = function(verticalAbsolute, horiontalAbsolute) {
    this.horizontalFactor = Product.round(horiontalAbsolute % 1, 1);
    this.verticalFactor = Product.round(verticalAbsolute % 1, 1);
}

Product.prototype.adjustFactors = function(verticalAdjust, horizontalAdjust) {

    horizontalAdjust = Product.round(horizontalAdjust, 1);

    if (this.sequenceData.horizontalLoop)
        if (horizontalAdjust < 0) horizontalAdjust = 1 + horizontalAdjust;
    if (this.sequenceData.verticalLoop)
        if (verticalAdjust < 0) verticalAdjust = 1 + verticalAdjust;

    this.horizontalFactor += horizontalAdjust;
    this.verticalFactor += verticalAdjust;
    this.horizontalFactor = Math.abs(this.horizontalFactor) % 1;
    this.verticalFactor = Math.abs(this.verticalFactor) % 1;

}

Product.prototype.getCurrentImage = function() {
    return this.sequenceData.prefix + '-' + this.currentLevel + '-' + this.currentImage;
}

Product.prototype.getCurrentHotspots = function() {
    return this.sequenceData.hotspotLocations[this.getCurrentImage()];
}

Product.round = function(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

Product.errorLookup = function(errorCode) {
    var errorCodes = {
        "SNP0000": "No JSON defined",
        "SNP0001": "Invalid sequence JSON",
    };
    return errorCodes[errorCode];
}

/*
 *  The whole thing revolves around the user interacting with the screen and the Product class should not be the main driver of the application
 *  the Product is just something that manipulates which images should be shown or hidden and renders hotspots on top of it. 
 *
 *  Above the product should sit another class which is responsible for managing the touch and mouse events
 *
 */


