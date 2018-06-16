var gl; // gl instance
var gl2;
var glt;
var gl3;
var glcom;
var glbest;
var glbestcom;
// control realtime-show
var showing = true;

const Normal = 1<<1;
const Distor = 1<<2;
const Anti_distortion = 1<<3;
const Simple = 1<<4;

function initWebGLFromCanvas(canvas_name, mode) {
    var gl;
    var canvas = document.getElementById(canvas_name);
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        gl.rendercount = mode;
        gl.renderMode = mode;
    } catch (e) { }
    if (!gl) {
        alert("Could not initialize WebGL");
    }

    gl.mvMatrix = mat4.create(); // Warning: does not default to identity
    gl.pMatrix = mat4.create();  // Warning: does not default to identity  
    return gl;
}


function webGLStart() {
    judgemode.work = red;
    reset();
    gl = initWebGLFromCanvas("filter-canvas", 1);
    gl2 = initWebGLFromCanvas("filter2-canvas", 2);
    glt = initWebGLFromCanvas("filter0-canvas", 3);
    gl3 = initWebGLFromCanvas("filter3-canvas", 4);
    glcom = initWebGLFromCanvas("compare-canvas", 5);
    glbest = initWebGLFromCanvas("best-canvas", 6);
    glbestcom = initWebGLFromCanvas("bestcampare-canvas", 5);

    webGLStart_inside(gl);
    webGLStart_inside(gl2);
    webGLStart_inside(glt);
    webGLStart_inside(gl3);
    webGLStart_inside(glbest);
    setupQuad(glcom);
    initCompareShader(glcom);
    initCompareTexture(glcom);
    setupQuad(glbestcom);
    initCompareShader(glbestcom);
    initCompareTexture(glbestcom);
    glcom.init = true;
    glbestcom.init = true;
    paintLoop();
}

function webGLStart_inside(igl) {
    setupQuad(igl);
    initShaders(igl);
    initTexture(igl);

    wdebug(igl.clearColor(0.0, 0.0, 0.0, 1.0));
    wdebug(igl.enable(igl.DEPTH_TEST));


}
// end add
var fboid;

var k1x = 0.0;
var k1xa = 0.0;
var k1y = 0.0;
var k1ya = 0.0;
var k2x = 0.0;
var k2y = 0.0;
var k2xa = 0.0;
var k2ya = 0.0;
var k3x;
var k3y;
var k3xa = 0.0;
var k3ya = 0.0;

var maximum_alpha = 0.25;
//var shaderProgram;
var textureIsSafeToRender = false;

function paintLoop() {
    requestAnimFrame(paintLoop);
    if (showing) {
        drawScene(gl);
        drawScene(gl2);
        drawScene(glt);
        drawScene(gl3);
        Judge();
    } else {
        //GreedTick();
        EvoTick();
    }
}

function GreedTick() {

    if (trainCount <= 50) {
        train1();
    } else if (trainCount <= 100) {
        train2();
    } else if (trainCount <= 150) {
        train3();
    } else {
        console.log('study end');
        showing = true;
        isFirstTime = true;
        trainCount = 0;
    }
}

var compare = {};
compare.width = 256;
compare.height = 256;
compare.data = new Array(256 * 256 * 4);
compare.pixelsdata = new Array(256 * 256);
function Judge() {
    if (gl3.pixels == undefined || gl2.pixels == undefined || gl3.pixels == null || gl2.pixels == null) return;

    judgemode.work();
    createTexture(glcom, compare.data);
    drawJudge(glcom);
    //drawDiff(compare);
}

var bestcompare = {};
bestcompare.width = 256;
bestcompare.height = 256;
bestcompare.data = new Array(256 * 256 * 4);
bestcompare.pixelsdata = new Array(256 * 256);

function red_predict() {
    var sum = 0;
    var maxpixcels = compare.width * compare.height * 4;
    for (var x = 0; x < compare.width; x++) {
        for (var y = 0; y < compare.height; y++) {

            var i = (y * compare.width + x) * 4;  //calculate index
            var diff = Math.abs(gl2.pixels[i] - gl3.pixels[i]) + Math.abs(gl2.pixels[i + 1] - gl3.pixels[i + 1]) + Math.abs(gl2.pixels[i + 2] - gl3.pixels[i + 2]);
            compare.data[i + 3] = 255;
            sum += diff;
        }
    }
    return sum;
}


function red() {
    var sum = 0;
    var maxpixcels = compare.width * compare.height * 4;
    for (var x = 0; x < compare.width; x++) {
        for (var y = 0; y < compare.height; y++) {

            var i = (y * compare.width + x) * 4;  //calculate index
            var diff = Math.abs(gl2.pixels[i] - gl3.pixels[i]) + Math.abs(gl2.pixels[i + 1] - gl3.pixels[i + 1]) + Math.abs(gl2.pixels[i + 2] - gl3.pixels[i + 2]);
            var diff2 = gl3.pixels[i] + diff;
            if (diff2 > 255) diff2 = 255;
            compare.data[i] = diff2;
            compare.data[i + 1] = gl3.pixels[i + 1];
            compare.data[i + 2] = gl3.pixels[i + 2];

            compare.data[i + 3] = 255;
            sum += diff;
        }
    }
    return sum;
}
function red2() {
    var sum = 0;
    var maxpixcels = bestcompare.width * bestcompare.height * 4;
    for (var x = 0; x < bestcompare.width; x++) {
        for (var y = 0; y < bestcompare.height; y++) {

            var i = (y * bestcompare.width + x) * 4;  //calculate index
            var diff = Math.abs(glbest.pixels[i] - gl3.pixels[i]) + Math.abs(glbest.pixels[i + 1] - gl3.pixels[i + 1]) + Math.abs(glbest.pixels[i + 2] - gl3.pixels[i + 2]);
            var diff2 = gl3.pixels[i] + diff;
            if (diff2 > 255) diff2 = 255;
            bestcompare.data[i] = diff2;
            bestcompare.data[i + 1] = gl3.pixels[i + 1];
            bestcompare.data[i + 2] = gl3.pixels[i + 2];

            bestcompare.data[i + 3] = 255;
            sum += diff;
        }
    }
    return sum;
}
function cut_Predict() {
    var maxpixcels = compare.width * compare.height * 4;
    var sum = 0;
    for (var x = 0; x < compare.width; x++) {
        for (var y = 0; y < compare.height; y++) {

            var i = (y * compare.width + x) * 4;  //calculate index
            sum += Math.abs(gl2.pixels[i] - gl3.pixels[i]) + Math.abs(gl2.pixels[i + 1] - gl3.pixels[i + 1]) + Math.abs(gl2.pixels[i + 2] - gl3.pixels[i + 2]);
        }
    }
    return sum;
}
function cut() {
    //console.log('cut method');
    var maxpixcels = compare.width * compare.height * 4;
    var sum = 0;
    for (var x = 0; x < compare.width; x++) {
        for (var y = 0; y < compare.height; y++) {

            var i = (y * compare.width + x) * 4;  //calculate index

            compare.data[i] = Math.abs(gl2.pixels[i] - gl3.pixels[i]);
            compare.data[i + 1] = Math.abs(gl2.pixels[i + 1] - gl3.pixels[i + 1]);
            compare.data[i + 2] = Math.abs(gl2.pixels[i + 2] - gl3.pixels[i + 2]);
            compare.data[i + 3] = 255;
            sum += compare.data[0] + compare.data[1] + compare.data[2];
        }
    }
    return sum;
}

function drawDiff(array) {
    glcom.putImageData(array, 0, 0);
}

// ~-~-~-~-~-~-~-~-~- UI related handling routines ~-~-~-~-~-~-~-~-~-

var same_alpha_factors = true; // Whether k1x and k1y are forced to be equal
//var same_alpha_factors2 = true;
function adjustAlphaFactor(direction, value) {
    adjustAlphaFactorBase(direction, value);
}
function adjustAlphaFactorBase(direction, value) {
    switch (direction) {
        case 'scale': {
            scale = value;
            document.getElementById("scale_value").value = scale;
            document.getElementById("scale_slider").value = value;
        } break;
        case 'k1': {
            k1x = (value * 0.01) * maximum_alpha;
            k1y = k1x;
            document.getElementById("k1_value").value = k1x;
            document.getElementById("k1_slider").value = value;
        } break;
        case 'k2': {
            k2x = (value * 0.01) * maximum_alpha;
            k2y = k2x;
            document.getElementById("k2_value").value = k2x;
            document.getElementById("k2_slider").value = value;
        } break;
        case 'k3': {
            k3x = (value * 0.01) * maximum_alpha;
            k3y = k3x;
            document.getElementById("k3_value").value = k3x;
            document.getElementById("k3_slider").value = value;
        } break;
        case 'k1a': {
            k1xa = (value * 0.01) * maximum_alpha;
            k1ya = k1xa;
            document.getElementById("k1a_value2").value = k1xa;
            document.getElementById("k1a_slider2").value = value;
        } break;
        case 'k2a': {
            k2xa = (value * 0.01) * maximum_alpha;
            k2ya = k2xa;
            document.getElementById("k2a_value2").value = k2xa;
            document.getElementById("k2a_slider2").value = value;
        } break;
        case 'k3a': {
            k3xa = (value * 0.01) * maximum_alpha;
            k3ya = k3xa;
            document.getElementById("k3a_value2").value = k3xa;
            document.getElementById("k3a_slider2").value = value;
        } break;
    }
}

function reset() {
    k1x = 0.0;
    k1xa = 0.0;
    k1y = 0.0;
    k1ya = 0.0;
    k2x = 0.0;
    k2y = 0.0;
    k2xa = 0.0;
    k2ya = 0.0;
    k3x = 0.0;
    k3y = 0.0;
    k3xa = 0.0;
    k3ya = 0.0;
    scale = 50;
    document.getElementById("k1_value").value = k1x;
    document.getElementById("k2_value").value = k2x;
    document.getElementById("k3_value").value = k3x;
    document.getElementById("k1a_value2").value = k1xa;
    document.getElementById("k2a_value2").value = k2xa;
    document.getElementById("k3a_value2").value = k3xa;

    document.getElementById("k1_slider").value = k1x;
    document.getElementById("k2_slider").value = k2x;
    document.getElementById("k3_slider").value = k3x;
    document.getElementById("k1a_slider2").value = k1xa;
    document.getElementById("k2a_slider2").value = k2xa;
    document.getElementById("k3a_slider2").value = k3xa;

    document.getElementById("scale_value").value = scale;
    document.getElementById("scale_slider").value = scale;

    showing = true;
    fitlist = [];
    worsefitlist = [];
}
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-

function debug() {
    trainAll();

}
var judgemode = {

};
judgemode.mode = 'red'
function changemode(str) {
    judgemode.mode = str;
    switch (str) {
        case 'red':
            judgemode.work = red;
            break;
        case 'cut':
            judgemode.work = cut;
            break;
    }
}

var isFirstTime = true;
var lastValue = {};
var loss = 0;
var trainCount = 0;
var start = false;
var bestfit = 0;
function study() {
    start = !start;
    if (start) {
        console.log('start study!');
        showing = false;
        StartEvo();
    } else {
        showing = true;
    }

}
var scale = 50;

function train1() {
    //console.log('trainning');
    if (isFirstTime) {
        console.log('train start');
        loss = red_predict();;
        trainCount = 0;
        isFirstTime = false;
        showing = false;
    }
    trainCount++;
    lastValue.k1 = k1x;

    var ch1 = (Math.random() - 0.5) * scale + denormal(lastValue.k1);

    adjustAlphaFactorBase('k1', ch1);

    drawScene(gl2);
    drawScene(gl);
    var loss2 = red_predict();
    //console.log(loss2);
    if (loss2 < loss) {
        //console.log('success');
        Judge();
        lastValue.k1 = k1x;
        loss = loss2;
    } else {
        //console.log('roll back');
        k1x = lastValue.k1;
    }
    adjustAlphaFactorBase('k1', denormal(k1x));

}

function train2() {

    trainCount++;
    lastValue.k2 = k2x;

    var ch2 = (Math.random() - 0.5) * scale + denormal(lastValue.k2);

    adjustAlphaFactorBase('k2', ch2);

    drawScene(gl2);
    drawScene(gl);
    var loss2 = red_predict();
    //console.log(loss2);
    if (loss2 < loss) {
        //console.log('success');
        Judge();
        lastValue.k2 = k2x;
        loss = loss2;
    } else {
        //console.log('roll back');
        k2x = lastValue.k2;
    }
    adjustAlphaFactorBase('k2', denormal(k2x));

}

function train3() {

    trainCount++;
    lastValue.k3 = k3x;

    var ch3 = (Math.random() - 0.5) * scale + denormal(lastValue.k3);

    adjustAlphaFactorBase('k3', ch3);

    drawScene(gl2);
    drawScene(gl);
    var loss2 = red_predict();
    //console.log(loss2);
    if (loss2 < loss) {
        //console.log('success');
        Judge();
        lastValue.k3 = k3x;
        loss = loss2;
    } else {
        //console.log('roll back');
        k3x = lastValue.k3;
    }
    adjustAlphaFactorBase('k3', denormal(k3x));

}

function normal(value) {
    return (value * 0.01) * maximum_alpha
}
function denormal(value) {
    return value / 0.01 / maximum_alpha;
}

function wdebug(func) {
    ctx = WebGLDebugUtils.makeDebugContext(func);
}

