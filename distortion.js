var gl;
var gl2;
var glt;
var gl3;
var glcom;
var glbest;
var glbestcom;
var glline;
/**
 *  control realtime-show. 
 * */
var showing = true;

var scale = 50;

var maximum_alpha = 0.5;
/**
 * renderMode: Do nothing.
 */
const Normal = 1<<1;
/**
 * Analog lens distortion.
 */
const Distor = 1<<2;
/**
 * Anti-distortion processing before lens distortion.
 */
const Anti_distortion = 1<<3;
/**
 * Used to render the texture directly.
 */
const Simple = 1<<4;

/**
 * 获取canvas元素并以此初始化webgl。
 * Get canvas element and initialize webgl.
 * @param {string} canvas_name 
 * @param {number} mode use **Normal**, **Distor**, **Anti_distortion**, or **Simple**, you can combine them.
 */
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
    if(CheckFlag(mode,Simple)){
        setupQuad(gl);
        initCompareShader(gl);
        initCompareTexture(gl);
        gl.init = true;
    }else{
        webGLStart_inside(gl);
    }
    return gl;
}

/**
 * 检查是否包含所需标志。Check to see if it contains the desired flag.
 * @param {number} input The flag you need ti check.
 * @param {number} flag Target flag.
 */
function CheckFlag(input, flag){
    if((input & flag) === flag) return true;
    return false;
}

function webGLStart() {
    judgemode.work = red;
    reset();
    gl = initWebGLFromCanvas("filter-canvas", Anti_distortion | Normal);
    gl2 = initWebGLFromCanvas("filter2-canvas", Anti_distortion | Distor);
    glt = initWebGLFromCanvas("filter0-canvas", Normal | Distor);
    gl3 = initWebGLFromCanvas("filter3-canvas", Normal | Normal);
    glcom = initWebGLFromCanvas("compare-canvas", Simple);
    glbest = initWebGLFromCanvas("best-canvas", Normal | Normal);
    glbestcom = initWebGLFromCanvas("bestcampare-canvas", Simple);
    //glline = initWebGLFromCanvas("line-canvas",Simple);
    paintLoop();
}

function webGLStart_inside(igl) {
    setupQuad(igl);
    initShaders(igl);
    initTexture(igl);

    wdebug(igl.clearColor(0.0, 0.0, 0.0, 1.0));
    wdebug(igl.enable(igl.DEPTH_TEST));

}


var k1x = 0.0;
var k1xa = 0.0;
var k1y = 0.0;
var k1ya = 0.0;
var k2x = 0.0;
var k2y = 0.0;
var k2xa = 0.0;
var k2ya = 0.0;
var k3x = 0.0;
var k3y = 0.0;
var k3xa = 0.0;
var k3ya = 0.0;


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

/**
 * 调节控制杆以控制相应的畸变系数。Adjust the lever to control the corresponding distortion factor.
 * @param {string} direction use **scale**, **k1** or **k1a** and so on.
 * @param {number} value Value is a number from 0 to 100. You may use *denormal()* to convert a decimal.
 */
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
    PSNRList = [];
    worsefitlist = [];
    RMSEList = [];
    genlist = [];
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


function normal(value) {
    return (value * 0.01) * maximum_alpha
}
function denormal(value) {
    return value / 0.01 / maximum_alpha;
}

function wdebug(func) {
    ctx = WebGLDebugUtils.makeDebugContext(func);
}

