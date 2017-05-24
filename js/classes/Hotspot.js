var Hotspot = function(x, y, hotspotData){
    this.x = x;
    this.y = y;
    this.hotspotData = hotspotData;    
}

Hotspot.prototype.toHTML = function(){
    var leftPosition = $("#hotspot-container").width() * this.x;
    var topPosition = $("#hotspot-container").height() * this.y;
    return '<div class="hotspot" style="left:'+leftPosition+'px;top:'+topPosition+'px;">'+"testing"+'</div>';
}

