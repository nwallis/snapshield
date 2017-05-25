var SEQUENCE_CONTAINER_ID = "#sequence-container";
var IMAGE_LOCATION = "./images/";
var IMAGE_EXTENSION = ".jpg";

var Shield = function(parentContainerId, sequenceData) {

    this._trackRatio = {
        x: 30,
        y: 30
    };

    $("#" + parentContainerId).append("<div id='sequence-container'></div>");

    this._productSequence = new Product(sequenceData);

    this.numberOfHorizontalImages = sequenceData.images;
    this.numberOfVerticalImages = sequenceData.levels;
    this.imagePrefix = sequenceData.prefix;
    this.numberOfImagesToLoad = this.numberOfHorizontalImages * this.numberOfVerticalImages;
    this.numberOfImagesLoaded = 0;
    this.preload();
}

Shield.prototype.preload = function() {
    for (var levelCount = 1; levelCount <= this.numberOfVerticalImages; levelCount++) {
        for (var imageCount = 1; imageCount <= this.numberOfHorizontalImages; imageCount++) {
            var image = new Image();
            image.onload = this.imageLoadComplete.bind(this);
            image.src = IMAGE_LOCATION + this.imagePrefix + '-' + levelCount + '-' + imageCount + IMAGE_EXTENSION;
        }
    }
}

Shield.prototype.imageLoadComplete = function() {
    this.numberOfImagesLoaded++;
    if (this.numberOfImagesToLoad == this.numberOfImagesLoaded) this.init();
}

Shield.prototype.init = function() {

    for (var levelCount = 1; levelCount <= this.numberOfVerticalImages; levelCount++) {
        for (var imageCount = 1; imageCount <= this.numberOfHorizontalImages; imageCount++) {
            $(SEQUENCE_CONTAINER_ID).prepend('<img id="' + this.imagePrefix + '-' + levelCount + '-' + imageCount + '" class="sequence-image" src="' + IMAGE_LOCATION + this.imagePrefix + '-' + levelCount + '-' + imageCount + IMAGE_EXTENSION + '">');
        }
    }

    this.update();

    $(window).on('resize', this.windowResized.bind(this));
    $(window).on('mouseup', this.stopTracking.bind(this));
    $(window).on('mousemove', this.mouseMoved.bind(this));

    $(SEQUENCE_CONTAINER_ID).on('mousedown', this.startTracking.bind(this));
    $(SEQUENCE_CONTAINER_ID + ' img').on('dragstart', this.sequenceImageDragged.bind(this));

    this.resizeImages();
}

Shield.prototype.sequenceImageDragged = function(event) {
    event.preventDefault();
}

Shield.prototype.windowResized = function() {
    this.resizeImages();
    this.update();
}

Shield.prototype.startTracking = function() {
    this._trackingMovement = true;
}

Shield.prototype.stopTracking = function() {
    this._trackingMovement = false;
    this._trackStart = undefined;
}

Shield.prototype.mouseMoved = function(e) {
    if (this._trackingMovement) {
        if (this._trackStart == undefined) this._trackStart = this.recordMousePosition(e);
        var currentPosition = this.recordMousePosition(e);
        var xDiff = currentPosition.xPos - this._trackStart.xPos;
        var yDiff = currentPosition.yPos - this._trackStart.yPos;

        $("#" + this._currentImage).hide();
        this._productSequence.move(yDiff, xDiff);
        this._trackStart = this.recordMousePosition(e);

        this.update();
    }
}

Shield.prototype.displayCurrentHotspots = function() {

    $("#hotspot-container").empty();
    this._productSequence.getCurrentHotspots().forEach(function(individualHotspot) {
        var hotspotVisual = new Hotspot(individualHotspot.x, individualHotspot.y, individualHotspot.hotspotData);
        $("#hotspot-container").append(hotspotVisual.toHTML());
    });

}

Shield.prototype.update = function() {
    this._currentImage = this._productSequence.getCurrentImage();
    $("#" + this._currentImage).show();
    this.displayCurrentHotspots();
}

Shield.prototype.recordMousePosition = function(e) {
    return {
        xPos: e.clientX,
        yPos: e.clientY
    };
}

Shield.prototype.resizeImages = function() {

    //Determine the correct CSS attribute to maintain aspect ratio
    var sequenceContainerWidth = $("#sequence-container").width();
    var sequenceContainerHeight = $("#sequence-container").height();
    if (sequenceContainerWidth > sequenceContainerHeight) {
        $(".sequence-image").css("width", "auto");
        $(".sequence-image").css("height", "100%");
    } else {
        $(".sequence-image").css("width", "100%");
        $(".sequence-image").css("height", "auto");
    }

    //Resize hotspot container
    var visibleImageOffset = $(".sequence-image:visible").offset();
    $("#hotspot-container").width($(".sequence-image:visible").width());
    $("#hotspot-container").height($(".sequence-image:visible").height());
    $("#hotspot-container").css("top", visibleImageOffset.top);
    $("#hotspot-container").css("left", visibleImageOffset.left);

}
