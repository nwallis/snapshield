var Product = function(sequenceData) {

    if (sequenceData == undefined) throw new Error(Product.errorLookup("SNP0000"));

    try {
        JSON.stringify(sequenceData);
    } catch (error) {
        throw new Error(Product.errorLookup("SNP0001"));
    }

    this.currentImage = sequenceData.startingImage;
    this.currentLevel = sequenceData.startingLevel;
    this.horizontalLoop = sequenceData.horizontalLoop;
    this.verticalLoop = sequenceData.verticalLoop;
    this.numberOfHorizontalImages = sequenceData.images;
    this.numberOfVerticalImages = sequenceData.levels;
    this.imagePrefix = sequenceData.prefix;
    this.hotspotLocations = sequenceData.hotspotLocations;
    this.hotspotDictionary = sequenceData.hotspotDictionary;

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

    if (this.horizontalLoop) {
        horizontalSteps %= this.numberOfHorizontalImages;
        this.currentImage = ((this.currentImage + this.numberOfHorizontalImages) + horizontalSteps) % this.numberOfHorizontalImages;
        if (this.currentImage == 0) this.currentImage = this.numberOfHorizontalImages;
    } else {
        this.currentImage = Math.min(Math.max(this.currentImage + horizontalSteps, 1), this.numberOfHorizontalImages);
    }

    if (this.verticalLoop) {
        verticalSteps %= this.numberOfVerticalImages;
        this.currentLevel = ((this.currentLevel + this.numberOfVerticalImages) + verticalSteps) % this.numberOfVerticalImages;
        if (this.currentLevel == 0) this.currentLevel = this.numberOfVerticalImages;
    } else {
        this.currentLevel = Math.min(Math.max(this.currentLevel + verticalSteps, 1), this.numberOfVerticalImages);
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

    if (this.horizontalLoop)
        if (horizontalAdjust < 0) horizontalAdjust = 1 + horizontalAdjust;
    if (this.verticalLoop)
        if (verticalAdjust < 0) verticalAdjust = 1 + verticalAdjust;

    this.horizontalFactor += horizontalAdjust;
    this.verticalFactor += verticalAdjust;
    this.horizontalFactor = Math.abs(this.horizontalFactor) % 1;
    this.verticalFactor = Math.abs(this.verticalFactor) % 1;
}

Product.prototype.getCurrentImage = function() {
    return this.imagePrefix + '-' + this.currentLevel + '-' + this.currentImage;
}

Product.prototype.getCurrentHotspots = function() {
    var hotspots = this.hotspotLocations[this.getCurrentImage()];
    var self = this;
    if (hotspots){
        hotspots.forEach(function(hotspot){
            hotspot.hotspotData = self.hotspotDictionary[hotspot.hotspotName];
        });
        return hotspots;
    }else{
        return [];
    }
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
