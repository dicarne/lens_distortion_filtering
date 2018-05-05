var gl; // gl instance
// add by dicarne
var gl2;
var glt;
var gl3
function webGLStart() {
    reset();
    var canvas = document.getElementById("filter-canvas");
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        gl.rendercount = 1;
    } catch (e) { }
    if (!gl) {
        alert("Could not initialize WebGL");
    }
    var canvas2 = document.getElementById("filter2-canvas");
    try {
        gl2 = canvas2.getContext("experimental-webgl");
        gl2.viewportWidth = canvas2.width;
        gl2.viewportHeight = canvas2.height;
        gl2.rendercount = 2;
    } catch (e) { }
    if (!gl2) {
        alert("Could not initialize WebGL");
    }
    var canvas3 = document.getElementById("filter0-canvas");
    try {
        glt = canvas3.getContext("experimental-webgl");
        glt.viewportWidth = canvas3.width;
        glt.viewportHeight = canvas3.height;
        glt.rendercount = 3;
    } catch (e) { }
    if (!glt) {
        alert("Could not initialize WebGL");
    }
    var canvas4 = document.getElementById("filter3-canvas");
    try {
        gl3 = canvas4.getContext("experimental-webgl");
        gl3.viewportWidth = canvas4.width;
        gl3.viewportHeight = canvas4.height;
        gl3.rendercount = 4;
    } catch (e) { }
    if (!glt) {
        alert("Could not initialize WebGL");
    }
    gl.mvMatrix = mat4.create(); // Warning: does not default to identity
    gl.pMatrix = mat4.create();  // Warning: does not default to identity    
    gl2.mvMatrix = mat4.create();
    gl2.pMatrix = mat4.create();
    glt.mvMatrix = mat4.create();
    glt.pMatrix = mat4.create();
    gl3.mvMatrix = mat4.create();
    gl3.pMatrix = mat4.create();
    webGLStart_inside(gl);
    webGLStart_inside(gl2);
    webGLStart_inside(glt);
    webGLStart_inside(gl3);
    paintLoop();
}

function webGLStart_inside(igl) {
    setupQuad(igl);
    initShaders(igl);
    initTexture(igl);

    ctx = WebGLDebugUtils.makeDebugContext(igl.clearColor(0.0, 0.0, 0.0, 1.0));
    ctx = WebGLDebugUtils.makeDebugContext(igl.enable(igl.DEPTH_TEST));


}
// end add
var fboid;

var alphax = 0.0;
var alphax2 = 0.0;
var alphay = 0.0;
var alphay2 = 0.0;
var k2x = 0.0;
var k2y = 0.0;
var k2xa = 0.0;
var k2ya = 0.0;

var maximum_alpha = 0.25;
//var shaderProgram;
var textureIsSafeToRender = false;


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript)
        return null;

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) { // Check for TEXT_NODE
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        ctx = WebGLDebugUtils.makeDebugContext(shader = gl.createShader(gl.FRAGMENT_SHADER));
    } else if (shaderScript.type == "x-shader/x-vertex") {
        ctx = WebGLDebugUtils.makeDebugContext(shader = gl.createShader(gl.VERTEX_SHADER));
    } else {
        return null;
    }

    ctx = WebGLDebugUtils.makeDebugContext(gl.shaderSource(shader, str));
    ctx = WebGLDebugUtils.makeDebugContext(gl.compileShader(shader));

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders(igl) {

    var fragmentShader = getShader(igl, "shader-fs");
    var vertexShader = getShader(igl, "shader-vs");
    var fragmentShader2 = getShader(igl, "shader2-fs");

    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram = igl.createProgram());
    ctx = WebGLDebugUtils.makeDebugContext(igl.attachShader(igl.shaderProgram, vertexShader));
    ctx = WebGLDebugUtils.makeDebugContext(igl.attachShader(igl.shaderProgram, fragmentShader));
    ctx = WebGLDebugUtils.makeDebugContext(igl.linkProgram(igl.shaderProgram));

    if (!igl.getProgramParameter(igl.shaderProgram, igl.LINK_STATUS)) {
        alert("Could not initialize shaders");
    }

    ctx = WebGLDebugUtils.makeDebugContext(igl.useProgram(igl.shaderProgram));

    // Enable vertex attribute arrays for position, color, uvs

    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram.inPosition = igl.getAttribLocation(igl.shaderProgram, "in_Position"));
    ctx = WebGLDebugUtils.makeDebugContext(igl.enableVertexAttribArray(igl.shaderProgram.inPosition));

    igl.shaderProgram.inColor = igl.getAttribLocation(igl.shaderProgram, "in_Color");
    ctx = WebGLDebugUtils.makeDebugContext(igl.enableVertexAttribArray(igl.shaderProgram.inColor));

    igl.shaderProgram.inTextureCoord = igl.getAttribLocation(igl.shaderProgram, "in_TextureCoord");
    ctx = WebGLDebugUtils.makeDebugContext(igl.enableVertexAttribArray(igl.shaderProgram.inTextureCoord));

    // Bind uniforms for matrices
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram.pMatrixUniform = igl.getUniformLocation(igl.shaderProgram, "uPMatrix"));
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram.mvMatrixUniform = igl.getUniformLocation(igl.shaderProgram, "uMVMatrix"));

    // Bind uniform for image dimensions and alpha factors
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram.imageDimensionsUniform = igl.getUniformLocation(igl.shaderProgram, "image_dimensions"));
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram.alphax = igl.getUniformLocation(igl.shaderProgram, "alphax"));
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram.alphay = igl.getUniformLocation(igl.shaderProgram, "alphay"));
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram.k2x = igl.getUniformLocation(igl.shaderProgram, "k2x"));
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram.k2y = igl.getUniformLocation(igl.shaderProgram, "k2y"));
    // -------------------------

    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram2 = igl.createProgram());
    ctx = WebGLDebugUtils.makeDebugContext(igl.attachShader(igl.shaderProgram2, vertexShader));
    ctx = WebGLDebugUtils.makeDebugContext(igl.attachShader(igl.shaderProgram2, fragmentShader2));
    ctx = WebGLDebugUtils.makeDebugContext(igl.linkProgram(igl.shaderProgram2));

    if (!igl.getProgramParameter(igl.shaderProgram2, igl.LINK_STATUS)) {
        alert("Could not initialize shaders");
    }

    ctx = WebGLDebugUtils.makeDebugContext(igl.useProgram(igl.shaderProgram2));

    // Enable vertex attribute arrays for position, color, uvs

    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram2.inPosition = igl.getAttribLocation(igl.shaderProgram2, "in_Position"));
    ctx = WebGLDebugUtils.makeDebugContext(igl.enableVertexAttribArray(igl.shaderProgram2.inPosition));

    igl.shaderProgram2.inColor = igl.getAttribLocation(igl.shaderProgram2, "in_Color");
    ctx = WebGLDebugUtils.makeDebugContext(igl.enableVertexAttribArray(igl.shaderProgram2.inColor));

    igl.shaderProgram2.inTextureCoord = igl.getAttribLocation(igl.shaderProgram2, "in_TextureCoord");
    ctx = WebGLDebugUtils.makeDebugContext(igl.enableVertexAttribArray(igl.shaderProgram2.inTextureCoord));

    // Bind uniforms for matrices
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram2.pMatrixUniform = igl.getUniformLocation(igl.shaderProgram2, "uPMatrix"));
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram2.mvMatrixUniform = igl.getUniformLocation(igl.shaderProgram2, "uMVMatrix"));

    // Bind uniform for image dimensions and alpha factors
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram2.imageDimensionsUniform = igl.getUniformLocation(igl.shaderProgram2, "image_dimensions"));
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram2.alphax = igl.getUniformLocation(igl.shaderProgram2, "alphax"));
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram2.alphay = igl.getUniformLocation(igl.shaderProgram2, "alphay"));
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram2.k2x = igl.getUniformLocation(igl.shaderProgram2, "k2x"));
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram2.k2y = igl.getUniformLocation(igl.shaderProgram2, "k2y"));

}

function setupQuad(igl) {
    // Set up VBO with quad data
    ctx = WebGLDebugUtils.makeDebugContext(igl.vboId = igl.createBuffer());
    ctx = WebGLDebugUtils.makeDebugContext(igl.bindBuffer(igl.ARRAY_BUFFER, igl.vboId));
    var vbo_data = [
        -0.5, 0.5, 0.0, 1.0,    // Vertex (xyzw)
        1.0, 0.0, 0.0, 1.0,     // RGBA
        0.0, 1.0,               // UV coords

        -0.5, -0.5, 0.0, 1.0,   // Vertex (xyzw)
        0.0, 1.0, 0.0, 1.0,     // RGBA
        0.0, 0.0,               // UV coords

        0.5, -0.5, 0.0, 1.0,    // Vertex (xyzw)
        0.0, 0.0, 1.0, 1.0,     // RGBA
        1.0, 0.0,               // UV coords

        0.5, 0.5, 0.0, 1.0,     // Vertex (xyzw)
        1.0, 1.0, 1.0, 1.0,     // RGBA
        1.0, 1.0                // UV coords
    ];
    ctx = WebGLDebugUtils.makeDebugContext(igl.bufferData(igl.ARRAY_BUFFER, new Float32Array(vbo_data), igl.STATIC_DRAW));
    // Set up VBO with indices data
    ctx = WebGLDebugUtils.makeDebugContext(igl.vboiId = igl.createBuffer());
    ctx = WebGLDebugUtils.makeDebugContext(igl.bindBuffer(igl.ELEMENT_ARRAY_BUFFER, igl.vboiId));
    var indices = [
        0, 1, 2,
        2, 3, 0
    ];
    ctx = WebGLDebugUtils.makeDebugContext(igl.bufferData(igl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), igl.STATIC_DRAW));
    igl.indices_count = indices.length;
}

function initTexture(igl) {
    igl.textures = [];
    igl.rb = [];
    igl.FBOs = [];
    ctx = WebGLDebugUtils.makeDebugContext(igl.textureId = igl.createTexture());
    igl.textureId.image = new Image();
    igl.textureId.image.src = "assets/dis_small.png";
    igl.textureId.image.onload = function () {
        //igl.textureId.image.width = 256;
        //igl.textureId.image.height = 256;
        ctx = WebGLDebugUtils.makeDebugContext(igl.bindTexture(igl.TEXTURE_2D, igl.textureId));
        ctx = WebGLDebugUtils.makeDebugContext(igl.pixelStorei(igl.UNPACK_FLIP_Y_WEBGL, true));
        ctx = WebGLDebugUtils.makeDebugContext(igl.texImage2D(igl.TEXTURE_2D, 0, igl.RGBA, igl.RGBA, igl.UNSIGNED_BYTE, igl.textureId.image));
        ctx = WebGLDebugUtils.makeDebugContext(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_MAG_FILTER, igl.LINEAR));
        ctx = WebGLDebugUtils.makeDebugContext(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_MIN_FILTER, igl.LINEAR));
        ctx = WebGLDebugUtils.makeDebugContext(igl.bindTexture(igl.TEXTURE_2D, null));

        for (var i = 0; i < 2; i++) {
            ctx = WebGLDebugUtils.makeDebugContext(igl.activeTexture(igl.TEXTURE0));
            var texture = igl.createTexture();
            ctx = WebGLDebugUtils.makeDebugContext(igl.bindTexture(igl.TEXTURE_2D, texture));
            //

            ctx = WebGLDebugUtils.makeDebugContext(igl.texImage2D(igl.TEXTURE_2D, 0, igl.RGBA, igl.RGBA, igl.UNSIGNED_BYTE, igl.textureId.image));
            ctx = WebGLDebugUtils.makeDebugContext(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_WRAP_S, igl.CLAMP_TO_EDGE));
            ctx = WebGLDebugUtils.makeDebugContext(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_WRAP_T, igl.CLAMP_TO_EDGE));
            ctx = WebGLDebugUtils.makeDebugContext(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_MIN_FILTER, igl.LINEAR));
            ctx = WebGLDebugUtils.makeDebugContext(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_MAG_FILTER, igl.LINEAR));

            var fb = igl.createFramebuffer();
            igl.bindFramebuffer(igl.FRAMEBUFFER, fb);
            igl.framebufferTexture2D(igl.FRAMEBUFFER, igl.COLOR_ATTACHMENT0, igl.TEXTURE_2D, texture, 0);
            var trb = igl.createRenderbuffer();
            ctx = WebGLDebugUtils.makeDebugContext(igl.bindRenderbuffer(igl.RENDERBUFFER, trb));
            ctx = WebGLDebugUtils.makeDebugContext(igl.renderbufferStorage(igl.RENDERBUFFER, igl.DEPTH_COMPONENT16, 256, 256));
            //ctx = WebGLDebugUtils.makeDebugContext(igl.renderbufferStorage(igl.RENDERBUFFER, igl.DEPTH_COMPONENT16, igl.viewportWidth, igl.viewportHeight));
            ctx = WebGLDebugUtils.makeDebugContext(igl.framebufferRenderbuffer(igl.FRAMEBUFFER, igl.DEPTH_ATTACHMENT, igl.RENDERBUFFER, trb));
            ctx = WebGLDebugUtils.makeDebugContext(igl.bindRenderbuffer(igl.RENDERBUFFER, null));

            igl.rb.push(trb);
            igl.textures.push(texture);
            igl.FBOs.push(fb);
            ctx = WebGLDebugUtils.makeDebugContext(igl.bindTexture(igl.TEXTURE_2D, null));
        }
        textureIsSafeToRender = true;
    }

    igl.imageDimensions = new Float32Array([igl.textureId.image.width, igl.textureId.image.height]);

}

function drawScene(gl) {
    ctx = WebGLDebugUtils.makeDebugContext(gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight));

    if (textureIsSafeToRender == false) {
        console.log("Still can't render stuff if the texture hasn't been loaded yet");
        return;
    }
    ctx = WebGLDebugUtils.makeDebugContext(gl.useProgram(gl.shaderProgram));
    // Set matrix uniforms
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, gl.pMatrix);
    mat4.identity(gl.mvMatrix);
    mat4.translate(gl.mvMatrix, [0.0, 0.0, -1.2]);
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniformMatrix4fv(gl.shaderProgram.pMatrixUniform, false, gl.pMatrix));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniformMatrix4fv(gl.shaderProgram.mvMatrixUniform, false, gl.mvMatrix));

    // Set image dimensions uniform
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform2fv(gl.shaderProgram.imageDimensionsUniform, gl.imageDimensions));
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindTexture(gl.TEXTURE_2D, gl.textureId));
    ctx = WebGLDebugUtils.makeDebugContext(gl.activeTexture(gl.TEXTURE0));
    var sampler2D_loc = gl.getUniformLocation(gl.shaderProgram, "texture_diffuse");

    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1i(sampler2D_loc, 0));

    // Bind vertex data and set vertex attributes (as from a VAO)
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindBuffer(gl.ARRAY_BUFFER, gl.vboId));
    var a, b, c, d;
    if (gl.rendercount <= 2) {
        a = alphax;
        b = alphay;
        c = k2x;
        d = k2y;
    } else {
        a = 0;
        b = 0;
        c = 0;
        d = 0;
    }
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram.alphax, new Float32Array([a])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram.alphay, new Float32Array([b])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram.k2x, new Float32Array([c])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram.k2y, new Float32Array([d])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindFramebuffer(gl.FRAMEBUFFER, gl.FBOs[0]));
    ctx = WebGLDebugUtils.makeDebugContext(gl.vertexAttribPointer(gl.shaderProgram.inPosition, 4, gl.FLOAT, false, 10 * 4, 0));
    ctx = WebGLDebugUtils.makeDebugContext(gl.vertexAttribPointer(gl.shaderProgram.inColor, 4, gl.FLOAT, false, 10 * 4, 4 * 4));

    ctx = WebGLDebugUtils.makeDebugContext(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.vboiId));
    ctx = WebGLDebugUtils.makeDebugContext(gl.vertexAttribPointer(gl.shaderProgram.inTextureCoord, 2, gl.FLOAT, false, 10 * 4, 8 * 4));

    ctx = WebGLDebugUtils.makeDebugContext(gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT));
    ctx = WebGLDebugUtils.makeDebugContext(gl.drawElements(gl.TRIANGLES, gl.indices_count, gl.UNSIGNED_SHORT, 0));
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindTexture(gl.TEXTURE_2D, gl.textures[0]));

    /*---------------------------------------------------------------*/
    ctx = WebGLDebugUtils.makeDebugContext(gl.useProgram(gl.shaderProgram2));
    
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniformMatrix4fv(gl.shaderProgram2.pMatrixUniform, false, gl.pMatrix));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniformMatrix4fv(gl.shaderProgram2.mvMatrixUniform, false, gl.mvMatrix));

    // Set image dimensions uniform
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform2fv(gl.shaderProgram2.imageDimensionsUniform, gl.imageDimensions));
    //ctx = WebGLDebugUtils.makeDebugContext(gl.bindTexture(gl.TEXTURE_2D, gl.textureId));
    //ctx = WebGLDebugUtils.makeDebugContext(gl.activeTexture(gl.TEXTURE0));
    var sampler2D_loc = gl.getUniformLocation(gl.shaderProgram2, "texture_diffuse");

    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1i(sampler2D_loc, 0));

    // Bind vertex data and set vertex attributes (as from a VAO)
    //ctx = WebGLDebugUtils.makeDebugContext(gl.bindBuffer(gl.ARRAY_BUFFER, gl.vboId));
    if (gl.rendercount == 2 || gl.rendercount == 3) {
        a = alphax2;
        b = alphay2;
        c = k2xa;
        d = k2ya;
    } else if (gl.rendercount == 1 || gl.rendercount == 4) {
        a = 0;
        b = 0;
        c = 0;
        d = 0;
    }
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram2.alphax, new Float32Array([a])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram2.alphay, new Float32Array([b])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram2.k2x, new Float32Array([c])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram2.k2y, new Float32Array([d])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindFramebuffer(gl.FRAMEBUFFER, gl.FBOs[1]));
    ctx = WebGLDebugUtils.makeDebugContext(gl.vertexAttribPointer(gl.shaderProgram2.inPosition, 4, gl.FLOAT, false, 10 * 4, 0));
    ctx = WebGLDebugUtils.makeDebugContext(gl.vertexAttribPointer(gl.shaderProgram2.inColor, 4, gl.FLOAT, false, 10 * 4, 4 * 4));

    ctx = WebGLDebugUtils.makeDebugContext(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.vboiId));
    ctx = WebGLDebugUtils.makeDebugContext(gl.vertexAttribPointer(gl.shaderProgram2.inTextureCoord, 2, gl.FLOAT, false, 10 * 4, 8 * 4));

    ctx = WebGLDebugUtils.makeDebugContext(gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT));
    ctx = WebGLDebugUtils.makeDebugContext(gl.drawElements(gl.TRIANGLES, gl.indices_count, gl.UNSIGNED_SHORT, 0));
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindTexture(gl.TEXTURE_2D, gl.textures[1]));
    gl.pixels = new Uint8Array(gl.textureId.image.width * gl.textureId.image.height * 4);
    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, gl.pixels);

    ctx = WebGLDebugUtils.makeDebugContext(gl.bindFramebuffer(gl.FRAMEBUFFER, null));

    ctx = WebGLDebugUtils.makeDebugContext(gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT));
    ctx = WebGLDebugUtils.makeDebugContext(gl.drawElements(gl.TRIANGLES, gl.indices_count, gl.UNSIGNED_SHORT, 0));

    ctx = WebGLDebugUtils.makeDebugContext(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null));
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindBuffer(gl.ARRAY_BUFFER, null));
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindTexture(gl.TEXTURE_2D, null));
}

function paintLoop() {
    requestAnimFrame(paintLoop);
    drawScene(gl);
    drawScene(gl2);
    drawScene(glt);
    drawScene(gl3);
    //Judeg();
}

function Judge() {
    if (gl2.pixels.length <= 1) return;
    var s1 = [];
    var s2 = [];
    var checkarea = 100;

    for (var i = 0; i < 512; i++) {
        if (i >= checkarea && i < 512 - checkarea) {
            var centerheigh = Math.abs(256 - i);
            var leftside = Math.sqrt(checkarea * checkarea - centerheigh * centerheigh);
            var t = gl2.pixels.slice(512 * 4 * i + leftside * 4, 512 * 4 * i + (512 - leftside) * 4);
            for (var j = 0; j < t.length - 1; j += 4) {
                s1.push((t[j] * 299 + t[j + 1] * 587 + t[j + 2] * 114 + 500));
            }
            var t2 = glt.pixels.slice(512 * 4 * i + leftside * 4, 512 * 4 * i + (512 - leftside) * 4);
            for (var j = 0; j < t2.length - 1; j += 4) {
                s2.push((t2[j] * 299 + t2[j + 1] * 587 + t2[j + 2] * 114 + 500));
            }
        }

    }
    console.log(s1);

    var res = s1.map(function (a, b, c) {
        return Math.abs(a - s2[b]);
    });
    var sumnum = res.reduce(function (total, num) {
        return total + num;
    });
    document.getElementById("resultsum").innerHTML = sumnum;
}


// ~-~-~-~-~-~-~-~-~- UI related handling routines ~-~-~-~-~-~-~-~-~-

var same_alpha_factors = true; // Whether alphax and alphay are forced to be equal
//var same_alpha_factors2 = true;
function adjustAlphaFactor(direction, value) {
    switch (direction) {
        case 'k1': {
            alphax = (value * 0.01) * maximum_alpha;
            alphay = alphax;
            document.getElementById("k1_value").value = alphax;
        } break;
        case 'k2': {
            k2x = (value * 0.01) * maximum_alpha;
            k2y = k2x;
            document.getElementById("k2_value").value = k2x;
        } break;
        case 'k1a': {
            alphax2 = (value * 0.01) * maximum_alpha;
            alphay2 = alphax2;
            document.getElementById("k1a_value2").value = alphax2;
        } break;
        case 'k2a': {
            k2xa = (value * 0.01) * maximum_alpha;
            k2ya = k2xa;
            document.getElementById("k2a_value2").value = k2xa;
        } break;
    }
}

function reset() {
    alphax = 0.0;
    alphax2 = 0.0;
    alphay = 0.0;
    alphay2 = 0.0;
    k2x = 0.0;
    k2y = 0.0;
    k2xa = 0.0;
    k2ya = 0.0;
    document.getElementById("k1_value").value = alphax;
    document.getElementById("k2_value").value = k2x;
    document.getElementById("k1a_value2").value = alphax2;
    document.getElementById("k2a_value2").value = k2xa;

    document.getElementById("k1_slider").value = alphax;
    document.getElementById("k2_slider").value = k2x;
    document.getElementById("k1a_slider2").value = alphax2;
    document.getElementById("k2a_slider2").value = k2xa;
}
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-