var MOVEMENT_CONTAINER_SELECTOR = "#sequence-container";

var Shield = function(sequenceJSON) {

    var self = this;

    //productSequence, currentImage, _trackingMovement = false, trackStart;
    this._trackRatio = {
        x: 30,
        y: 30
    };

    this._currentHotspots = [];
    this._productSequence = new Product(sequenceJSON);

    //refactor this into update sequence - #######
    this._currentImage = this._productSequence.getCurrentImage();
    $("#" + this._currentImage).show();

    //Window handlers
    $(window).on('resize', this.windowResized.bind(this));
    $(window).on('mouseup', this.stopTracking.bind(this));
    $(window).on('mousemove', this.mouseMoved.bind(this));

    //Container handlers
    $(MOVEMENT_CONTAINER_SELECTOR).on('mousedown', this.startTracking.bind(this));
    $(MOVEMENT_CONTAINER_SELECTOR + ' img').on('dragstart', this.sequenceImageDragged.bind(this));

    this.resizeImages();
    this.update();
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
        this._currentImage = this._productSequence.getCurrentImage();
        $("#" + this._currentImage).show();
        this._trackStart = this.recordMousePosition(e);

        this.displayCurrentHotspots();
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
