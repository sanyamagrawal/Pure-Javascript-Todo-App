var ele = document.getElementsByClassName ("target")[0];
//ele.onmousedown = eleMouseDown;
ele.addEventListener ("mousedown" , eleMouseDown , false);

function eleMouseDown () {
    stateMouseDown = true;
    document.addEventListener ("mousemove" , eleMouseMove , false);
}

function eleMouseMove (ev) {
    var pX = ev.pageX;
    var pY = ev.pageY;
    ele.style.left = pX + "px";
    ele.style.top = pY + "px";
    document.addEventListener ("mouseup" , eleMouseUp , false);
}

function eleMouseUp () {
    document.removeEventListener ("mousemove" , eleMouseMove , false);
    document.removeEventListener ("mouseup" , eleMouseUp , false);
}