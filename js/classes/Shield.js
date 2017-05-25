var SEQUENCE_CONTAINER_ID = "#sequence-container";
var IMAGE_LOCATION = "./images/";
var IMAGE_EXTENSION = ".jpg";

var Shield = function(parentContainerId, sequenceData) {

    this._trackRatio = {
        x: 20,
        y: 20
    };

    $("#" + parentContainerId).append("<div id='sequence-container'></div>");
    $(SEQUENCE_CONTAINER_ID).append('<div id="hotspot-container" class="nodrag noselect"></div> <div id="menu-container"> </div>');

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
            $(SEQUENCE_CONTAINER_ID).prepend('<img id="' + this.imagePrefix + '-' + levelCount + '-' + imageCount + '" class="sequence-image noselect nodrag" src="' + IMAGE_LOCATION + this.imagePrefix + '-' + levelCount + '-' + imageCount + IMAGE_EXTENSION + '">');
        }
    }

    this.update();

    $(window).on('resize', this.windowResized.bind(this));
    $(window).on('mouseup touchend', this.stopTracking.bind(this));
    $(window).on('mousemove touchmove', this.mouseMoved.bind(this));

    $(SEQUENCE_CONTAINER_ID).on('mousedown touchstart', this.startTracking.bind(this));
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

Shield.prototype.startTracking = function(e) {
    this._trackingMovement = true;
}

Shield.prototype.stopTracking = function(e) {
    this._trackingMovement = false;
    this._trackStart = undefined;
}

Shield.prototype.mouseMoved = function(e) {

    if (this._trackingMovement) {

        //Stop the default drag movement on mobiles
        e.preventDefault();

        //Store the start position if we don't have one                
        if (this._trackStartX == undefined) this._trackStartX = this.recordMousePosition(e);
        if (this._trackStartY == undefined) this._trackStartY = this.recordMousePosition(e);

        //Find the difference in positions 
        var currentPosition = this.recordMousePosition(e);
        var xDiff = Math.floor((currentPosition.xPos - this._trackStartX.xPos) / this._trackRatio.x);
        var yDiff = Math.floor((currentPosition.yPos - this._trackStartY.yPos) / this._trackRatio.y);

        //Record new positions for X and Y if they trigger a new movement
        if (Math.abs(xDiff)>=1) this._trackStartX = this.recordMousePosition(e);
        if (Math.abs(yDiff)>=1) this._trackStartY = this.recordMousePosition(e);

        //Hide the current image
        $("#" + this._currentImage).hide();

        //Move the data model and update
        this._productSequence.move(yDiff, xDiff);
        this.update();

        //Record the new mouse position
        //this._trackStart = this.recordMousePosition(e);
    }

}

Shield.prototype.recordMousePosition = function(e) {
    return {
        xPos: (e.originalEvent.touches != undefined) ? e.originalEvent.touches[0].clientX : e.clientX,
        yPos: (e.originalEvent.touches != undefined) ? e.originalEvent.touches[0].clientY : e.clientY
    };
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
