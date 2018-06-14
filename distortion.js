var gl; // gl instance
var gl2;
var glt;
var gl3;
var glcom;
var glbest;
var glbestcom;
// control realtime-show
var showing = true;
function webGLStart() {
    judgemode.work = red;
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
    if (!gl3) {
        alert("Could not initialize WebGL");
    }
    var canvas5 = document.getElementById("compare-canvas");
    try {
        glcom = canvas5.getContext("experimental-webgl");

        //glcom = canvas5.getContext("2d");
        glcom.viewportWidth = canvas5.width;
        glcom.viewportHeight = canvas5.height;
        glcom.rendercount = 5;
    } catch (e) { }
    if (!glcom) {
        alert("Could not initialize");
    }
    var canvas6 = document.getElementById("best-canvas");
    try {
        glbest = canvas6.getContext("experimental-webgl");

        //glcom = canvas5.getContext("2d");
        glbest.viewportWidth = canvas6.width;
        glbest.viewportHeight = canvas6.height;
        glbest.rendercount = 6;
    } catch (e) { }
    if (!glbest) {
        alert("Could not initialize");
    }
    var canvas7 = document.getElementById("bestcampare-canvas");
    try {
        glbestcom = canvas7.getContext("experimental-webgl");

        //glcom = canvas5.getContext("2d");
        glbestcom.viewportWidth = canvas7.width;
        glbestcom.viewportHeight = canvas7.height;
        glbestcom.rendercount = 5;
    } catch (e) { }
    if (!glbestcom) {
        alert("Could not initialize");
    }
    gl.mvMatrix = mat4.create(); // Warning: does not default to identity
    gl.pMatrix = mat4.create();  // Warning: does not default to identity    
    gl2.mvMatrix = mat4.create();
    gl2.pMatrix = mat4.create();
    glt.mvMatrix = mat4.create();
    glt.pMatrix = mat4.create();
    gl3.mvMatrix = mat4.create();
    gl3.pMatrix = mat4.create();
    glcom.mvMatrix = mat4.create();
    glcom.pMatrix = mat4.create();
    glbest.mvMatrix = mat4.create();
    glbest.pMatrix = mat4.create();
    glbestcom.mvMatrix = mat4.create();
    glbestcom.pMatrix = mat4.create();
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
        wdebug(shader = gl.createShader(gl.FRAGMENT_SHADER));
    } else if (shaderScript.type == "x-shader/x-vertex") {
        wdebug(shader = gl.createShader(gl.VERTEX_SHADER));
    } else {
        return null;
    }

    wdebug(gl.shaderSource(shader, str));
    wdebug(gl.compileShader(shader));

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initCompareShader(igl) {
    var vertexShader = getShader(igl, "simple-vs");
    var frag_compare_shader = getShader(igl, "simple-fs");
    wdebug(igl.shaderProgram = igl.createProgram());
    wdebug(igl.attachShader(igl.shaderProgram, vertexShader));
    wdebug(igl.attachShader(igl.shaderProgram, frag_compare_shader));
    wdebug(igl.linkProgram(igl.shaderProgram));
    if (!igl.getProgramParameter(igl.shaderProgram, igl.LINK_STATUS)) {
        alert("Could not initialize shaders");
    }

    wdebug(igl.useProgram(igl.shaderProgram));

    // Enable vertex attribute arrays for position, color, uvs

    wdebug(igl.shaderProgram.inPosition = igl.getAttribLocation(igl.shaderProgram, "in_Position"));
    wdebug(igl.enableVertexAttribArray(igl.shaderProgram.inPosition));

    igl.shaderProgram.inColor = igl.getAttribLocation(igl.shaderProgram, "in_Color");
    wdebug(igl.enableVertexAttribArray(igl.shaderProgram.inColor));

    igl.shaderProgram.inTextureCoord = igl.getAttribLocation(igl.shaderProgram, "in_TextureCoord");
    wdebug(igl.enableVertexAttribArray(igl.shaderProgram.inTextureCoord));

}

function initShaders(igl) {

    var fragmentShader = getShader(igl, "shader2-fs");
    var vertexShader = getShader(igl, "shader-vs");
    var fragmentShader2 = getShader(igl, "shader-fs");
    //var frag_compare_shader = getShader(igl, "compare-fs");

    wdebug(igl.shaderProgram = igl.createProgram());
    wdebug(igl.attachShader(igl.shaderProgram, vertexShader));
    wdebug(igl.attachShader(igl.shaderProgram, fragmentShader));
    wdebug(igl.linkProgram(igl.shaderProgram));

    if (!igl.getProgramParameter(igl.shaderProgram, igl.LINK_STATUS)) {
        alert("Could not initialize shaders");
    }

    wdebug(igl.useProgram(igl.shaderProgram));

    // Enable vertex attribute arrays for position, color, uvs

    wdebug(igl.shaderProgram.inPosition = igl.getAttribLocation(igl.shaderProgram, "in_Position"));
    wdebug(igl.enableVertexAttribArray(igl.shaderProgram.inPosition));

    igl.shaderProgram.inColor = igl.getAttribLocation(igl.shaderProgram, "in_Color");
    wdebug(igl.enableVertexAttribArray(igl.shaderProgram.inColor));

    igl.shaderProgram.inTextureCoord = igl.getAttribLocation(igl.shaderProgram, "in_TextureCoord");
    wdebug(igl.enableVertexAttribArray(igl.shaderProgram.inTextureCoord));

    // Bind uniforms for matrices
    wdebug(igl.shaderProgram.pMatrixUniform = igl.getUniformLocation(igl.shaderProgram, "uPMatrix"));
    wdebug(igl.shaderProgram.mvMatrixUniform = igl.getUniformLocation(igl.shaderProgram, "uMVMatrix"));

    // Bind uniform for image dimensions and alpha factors
    wdebug(igl.shaderProgram.imageDimensionsUniform = igl.getUniformLocation(igl.shaderProgram, "image_dimensions"));
    wdebug(igl.shaderProgram.k1x = igl.getUniformLocation(igl.shaderProgram, "k1x"));
    wdebug(igl.shaderProgram.k1y = igl.getUniformLocation(igl.shaderProgram, "k1y"));
    wdebug(igl.shaderProgram.k2x = igl.getUniformLocation(igl.shaderProgram, "k2x"));
    wdebug(igl.shaderProgram.k2y = igl.getUniformLocation(igl.shaderProgram, "k2y"));
    wdebug(igl.shaderProgram.k3x = igl.getUniformLocation(igl.shaderProgram, "k3x"));
    wdebug(igl.shaderProgram.k3y = igl.getUniformLocation(igl.shaderProgram, "k3y"));
    // -------------------------

    wdebug(igl.shaderProgram2 = igl.createProgram());
    wdebug(igl.attachShader(igl.shaderProgram2, vertexShader));
    wdebug(igl.attachShader(igl.shaderProgram2, fragmentShader2));
    wdebug(igl.linkProgram(igl.shaderProgram2));

    if (!igl.getProgramParameter(igl.shaderProgram2, igl.LINK_STATUS)) {
        alert("Could not initialize shaders");
    }

    wdebug(igl.useProgram(igl.shaderProgram2));

    // Enable vertex attribute arrays for position, color, uvs

    wdebug(igl.shaderProgram2.inPosition = igl.getAttribLocation(igl.shaderProgram2, "in_Position"));
    wdebug(igl.enableVertexAttribArray(igl.shaderProgram2.inPosition));

    igl.shaderProgram2.inColor = igl.getAttribLocation(igl.shaderProgram2, "in_Color");
    wdebug(igl.enableVertexAttribArray(igl.shaderProgram2.inColor));

    igl.shaderProgram2.inTextureCoord = igl.getAttribLocation(igl.shaderProgram2, "in_TextureCoord");
    wdebug(igl.enableVertexAttribArray(igl.shaderProgram2.inTextureCoord));

    // Bind uniforms for matrices
    wdebug(igl.shaderProgram2.pMatrixUniform = igl.getUniformLocation(igl.shaderProgram2, "uPMatrix"));
    wdebug(igl.shaderProgram2.mvMatrixUniform = igl.getUniformLocation(igl.shaderProgram2, "uMVMatrix"));

    // Bind uniform for image dimensions and alpha factors
    wdebug(igl.shaderProgram2.imageDimensionsUniform = igl.getUniformLocation(igl.shaderProgram2, "image_dimensions"));
    wdebug(igl.shaderProgram2.k1x = igl.getUniformLocation(igl.shaderProgram2, "k1x"));
    wdebug(igl.shaderProgram2.k1y = igl.getUniformLocation(igl.shaderProgram2, "k1y"));
    wdebug(igl.shaderProgram2.k2x = igl.getUniformLocation(igl.shaderProgram2, "k2x"));
    wdebug(igl.shaderProgram2.k2y = igl.getUniformLocation(igl.shaderProgram2, "k2y"));
    wdebug(igl.shaderProgram2.k3x = igl.getUniformLocation(igl.shaderProgram2, "k3x"));
    wdebug(igl.shaderProgram2.k3y = igl.getUniformLocation(igl.shaderProgram2, "k3y"));

}

function setupQuad(igl) {
    // Set up VBO with quad data
    wdebug(igl.vboId = igl.createBuffer());
    wdebug(igl.bindBuffer(igl.ARRAY_BUFFER, igl.vboId));
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
    var full_vbo_data = [
        -1.0, 1.0, 0.0, 1.0,    // Vertex (xyzw)
        1.0, 0.0, 0.0, 1.0,     // RGBA
        0.0, 1.0,               // UV coords

        -1.0, -1.0, 0.0, 1.0,   // Vertex (xyzw)
        0.0, 1.0, 0.0, 1.0,     // RGBA
        0.0, 0.0,               // UV coords

        1.0, -1.0, 0.0, 1.0,    // Vertex (xyzw)
        0.0, 0.0, 1.0, 1.0,     // RGBA
        1.0, 0.0,               // UV coords

        1.0, 1.0, 0.0, 1.0,     // Vertex (xyzw)
        1.0, 1.0, 1.0, 1.0,     // RGBA
        1.0, 1.0                // UV coords
    ];
    if (igl.rendercount == 5)
        wdebug(igl.bufferData(igl.ARRAY_BUFFER, new Float32Array(full_vbo_data), igl.STATIC_DRAW));
    else
        wdebug(igl.bufferData(igl.ARRAY_BUFFER, new Float32Array(vbo_data), igl.STATIC_DRAW));
    // Set up VBO with indices data
    wdebug(igl.vboiId = igl.createBuffer());
    wdebug(igl.bindBuffer(igl.ELEMENT_ARRAY_BUFFER, igl.vboiId));
    var indices = [
        0, 1, 2,
        2, 3, 0
    ];
    wdebug(igl.bufferData(igl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), igl.STATIC_DRAW));
    igl.indices_count = indices.length;
}

function initTexture(igl) {
    igl.textures = [];
    igl.rb = [];
    igl.FBOs = [];
    wdebug(igl.textureId = igl.createTexture());
    igl.textureId.image = new Image();
    igl.textureId.image.src = "assets/testchildsmall.png";
    igl.textureId.image.onload = function () {
        //igl.textureId.image.width = 256;
        //igl.textureId.image.height = 256;
        wdebug(igl.bindTexture(igl.TEXTURE_2D, igl.textureId));
        wdebug(igl.pixelStorei(igl.UNPACK_FLIP_Y_WEBGL, true));
        wdebug(igl.texImage2D(igl.TEXTURE_2D, 0, igl.RGBA, igl.RGBA, igl.UNSIGNED_BYTE, igl.textureId.image));
        wdebug(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_MAG_FILTER, igl.LINEAR));
        wdebug(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_MIN_FILTER, igl.LINEAR));
        wdebug(igl.bindTexture(igl.TEXTURE_2D, null));

        for (var i = 0; i < 2; i++) {
            wdebug(igl.activeTexture(igl.TEXTURE0));
            var texture = igl.createTexture();
            wdebug(igl.bindTexture(igl.TEXTURE_2D, texture));
            //

            wdebug(igl.texImage2D(igl.TEXTURE_2D, 0, igl.RGBA, igl.RGBA, igl.UNSIGNED_BYTE, igl.textureId.image));
            wdebug(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_WRAP_S, igl.CLAMP_TO_EDGE));
            wdebug(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_WRAP_T, igl.CLAMP_TO_EDGE));
            wdebug(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_MIN_FILTER, igl.LINEAR));
            wdebug(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_MAG_FILTER, igl.LINEAR));

            var fb = igl.createFramebuffer();
            igl.bindFramebuffer(igl.FRAMEBUFFER, fb);
            igl.framebufferTexture2D(igl.FRAMEBUFFER, igl.COLOR_ATTACHMENT0, igl.TEXTURE_2D, texture, 0);
            var trb = igl.createRenderbuffer();
            wdebug(igl.bindRenderbuffer(igl.RENDERBUFFER, trb));
            wdebug(igl.renderbufferStorage(igl.RENDERBUFFER, igl.DEPTH_COMPONENT16, 256, 256));
            //wdebug(igl.renderbufferStorage(igl.RENDERBUFFER, igl.DEPTH_COMPONENT16, igl.viewportWidth, igl.viewportHeight));
            wdebug(igl.framebufferRenderbuffer(igl.FRAMEBUFFER, igl.DEPTH_ATTACHMENT, igl.RENDERBUFFER, trb));
            wdebug(igl.bindRenderbuffer(igl.RENDERBUFFER, null));

            igl.rb.push(trb);
            igl.textures.push(texture);
            igl.FBOs.push(fb);
            wdebug(igl.bindTexture(igl.TEXTURE_2D, null));
        }
        textureIsSafeToRender = true;
    }

    igl.imageDimensions = new Float32Array([igl.textureId.image.width, igl.textureId.image.height]);

}

function drawScene(gl) {
    wdebug(gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight));

    if (textureIsSafeToRender == false) {
        console.log("Still can't render stuff if the texture hasn't been loaded yet");
        return;
    }
    wdebug(gl.useProgram(gl.shaderProgram));
    // Set matrix uniforms
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, gl.pMatrix);
    mat4.identity(gl.mvMatrix);
    mat4.translate(gl.mvMatrix, [0.0, 0.0, -1.2]);
    wdebug(gl.uniformMatrix4fv(gl.shaderProgram.pMatrixUniform, false, gl.pMatrix));
    wdebug(gl.uniformMatrix4fv(gl.shaderProgram.mvMatrixUniform, false, gl.mvMatrix));

    // Set image dimensions uniform
    wdebug(gl.uniform2fv(gl.shaderProgram.imageDimensionsUniform, gl.imageDimensions));
    wdebug(gl.bindTexture(gl.TEXTURE_2D, gl.textureId));
    wdebug(gl.activeTexture(gl.TEXTURE0));
    var sampler2D_loc = gl.getUniformLocation(gl.shaderProgram, "texture_diffuse");

    wdebug(gl.uniform1i(sampler2D_loc, 0));

    // Bind vertex data and set vertex attributes (as from a VAO)
    wdebug(gl.bindBuffer(gl.ARRAY_BUFFER, gl.vboId));
    var a, b, c, d;

    if (gl.rendercount <= 2) {
        a = k1x;
        b = k1y;
        c = k2x;
        d = k2y;
        e = k3x;
        f = k3y;
    } else {
        a = 0;
        b = 0;
        c = 0;
        d = 0;
        e = 0;
        f = 0;
    }
    wdebug(gl.uniform1fv(gl.shaderProgram.k1x, new Float32Array([a])));
    wdebug(gl.uniform1fv(gl.shaderProgram.k1y, new Float32Array([b])));
    wdebug(gl.uniform1fv(gl.shaderProgram.k2x, new Float32Array([c])));
    wdebug(gl.uniform1fv(gl.shaderProgram.k2y, new Float32Array([d])));
    wdebug(gl.uniform1fv(gl.shaderProgram.k3x, new Float32Array([e])));
    wdebug(gl.uniform1fv(gl.shaderProgram.k3y, new Float32Array([f])));
    wdebug(gl.bindFramebuffer(gl.FRAMEBUFFER, gl.FBOs[0]));
    wdebug(gl.vertexAttribPointer(gl.shaderProgram.inPosition, 4, gl.FLOAT, false, 10 * 4, 0));
    wdebug(gl.vertexAttribPointer(gl.shaderProgram.inColor, 4, gl.FLOAT, false, 10 * 4, 4 * 4));

    wdebug(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.vboiId));
    wdebug(gl.vertexAttribPointer(gl.shaderProgram.inTextureCoord, 2, gl.FLOAT, false, 10 * 4, 8 * 4));

    wdebug(gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT));
    wdebug(gl.drawElements(gl.TRIANGLES, gl.indices_count, gl.UNSIGNED_SHORT, 0));
    wdebug(gl.bindTexture(gl.TEXTURE_2D, gl.textures[0]));

    /*---------------------------------------------------------------*/
    wdebug(gl.useProgram(gl.shaderProgram2));

    wdebug(gl.uniformMatrix4fv(gl.shaderProgram2.pMatrixUniform, false, gl.pMatrix));
    wdebug(gl.uniformMatrix4fv(gl.shaderProgram2.mvMatrixUniform, false, gl.mvMatrix));

    // Set image dimensions uniform
    wdebug(gl.uniform2fv(gl.shaderProgram2.imageDimensionsUniform, gl.imageDimensions));
    //wdebug(gl.bindTexture(gl.TEXTURE_2D, gl.textureId));
    //wdebug(gl.activeTexture(gl.TEXTURE0));
    var sampler2D_loc = gl.getUniformLocation(gl.shaderProgram2, "texture_diffuse");

    wdebug(gl.uniform1i(sampler2D_loc, 0));

    // Bind vertex data and set vertex attributes (as from a VAO)
    //wdebug(gl.bindBuffer(gl.ARRAY_BUFFER, gl.vboId));
    if (gl.rendercount == 2 || gl.rendercount == 3) {
        a = k1xa;
        b = k1ya;
        c = k2xa;
        d = k2ya;
        e = k3xa;
        f = k3ya;
    } else if (gl.rendercount == 1 || gl.rendercount == 4) {
        a = 0;
        b = 0;
        c = 0;
        d = 0;
        e = 0;
        f = 0;
    }
    wdebug(gl.uniform1fv(gl.shaderProgram2.k1x, new Float32Array([a])));
    wdebug(gl.uniform1fv(gl.shaderProgram2.k1y, new Float32Array([b])));
    wdebug(gl.uniform1fv(gl.shaderProgram2.k2x, new Float32Array([c])));
    wdebug(gl.uniform1fv(gl.shaderProgram2.k2y, new Float32Array([d])));
    wdebug(gl.uniform1fv(gl.shaderProgram2.k3x, new Float32Array([e])));
    wdebug(gl.uniform1fv(gl.shaderProgram2.k3y, new Float32Array([f])));
    wdebug(gl.bindFramebuffer(gl.FRAMEBUFFER, gl.FBOs[1]));
    wdebug(gl.vertexAttribPointer(gl.shaderProgram2.inPosition, 4, gl.FLOAT, false, 10 * 4, 0));
    wdebug(gl.vertexAttribPointer(gl.shaderProgram2.inColor, 4, gl.FLOAT, false, 10 * 4, 4 * 4));

    wdebug(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.vboiId));
    wdebug(gl.vertexAttribPointer(gl.shaderProgram2.inTextureCoord, 2, gl.FLOAT, false, 10 * 4, 8 * 4));

    wdebug(gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT));
    wdebug(gl.drawElements(gl.TRIANGLES, gl.indices_count, gl.UNSIGNED_SHORT, 0));
    wdebug(gl.bindTexture(gl.TEXTURE_2D, gl.textures[1]));


    wdebug(gl.bindFramebuffer(gl.FRAMEBUFFER, null));

    wdebug(gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT));
    wdebug(gl.drawElements(gl.TRIANGLES, gl.indices_count, gl.UNSIGNED_SHORT, 0));
    gl.pixels = new Uint8Array(gl.textureId.image.width * gl.textureId.image.height * 4);
    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, gl.pixels);
    wdebug(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null));
    wdebug(gl.bindBuffer(gl.ARRAY_BUFFER, null));
    wdebug(gl.bindTexture(gl.TEXTURE_2D, null));
}
function drawBest(gl) {
    wdebug(gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight));

    if (textureIsSafeToRender == false) {
        console.log("Still can't render stuff if the texture hasn't been loaded yet");
        return;
    }
    wdebug(gl.useProgram(gl.shaderProgram));
    // Set matrix uniforms
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, gl.pMatrix);
    mat4.identity(gl.mvMatrix);
    mat4.translate(gl.mvMatrix, [0.0, 0.0, -1.2]);
    wdebug(gl.uniformMatrix4fv(gl.shaderProgram.pMatrixUniform, false, gl.pMatrix));
    wdebug(gl.uniformMatrix4fv(gl.shaderProgram.mvMatrixUniform, false, gl.mvMatrix));

    // Set image dimensions uniform
    wdebug(gl.uniform2fv(gl.shaderProgram.imageDimensionsUniform, gl.imageDimensions));
    wdebug(gl.bindTexture(gl.TEXTURE_2D, gl.textureId));
    wdebug(gl.activeTexture(gl.TEXTURE0));
    var sampler2D_loc = gl.getUniformLocation(gl.shaderProgram, "texture_diffuse");

    wdebug(gl.uniform1i(sampler2D_loc, 0));

    // Bind vertex data and set vertex attributes (as from a VAO)
    wdebug(gl.bindBuffer(gl.ARRAY_BUFFER, gl.vboId));
    var a, b, c, d;
    console.log(bestk1);
    a = bestk1;
    b = bestk1;
    c = bestk2;
    d = bestk2;
    e = 0;
    f = 0;



    wdebug(gl.uniform1fv(gl.shaderProgram.k1x, new Float32Array([a])));
    wdebug(gl.uniform1fv(gl.shaderProgram.k1y, new Float32Array([b])));
    wdebug(gl.uniform1fv(gl.shaderProgram.k2x, new Float32Array([c])));
    wdebug(gl.uniform1fv(gl.shaderProgram.k2y, new Float32Array([d])));
    wdebug(gl.uniform1fv(gl.shaderProgram.k3x, new Float32Array([e])));
    wdebug(gl.uniform1fv(gl.shaderProgram.k3y, new Float32Array([f])));
    wdebug(gl.bindFramebuffer(gl.FRAMEBUFFER, gl.FBOs[0]));
    wdebug(gl.vertexAttribPointer(gl.shaderProgram.inPosition, 4, gl.FLOAT, false, 10 * 4, 0));
    wdebug(gl.vertexAttribPointer(gl.shaderProgram.inColor, 4, gl.FLOAT, false, 10 * 4, 4 * 4));

    wdebug(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.vboiId));
    wdebug(gl.vertexAttribPointer(gl.shaderProgram.inTextureCoord, 2, gl.FLOAT, false, 10 * 4, 8 * 4));

    wdebug(gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT));
    wdebug(gl.drawElements(gl.TRIANGLES, gl.indices_count, gl.UNSIGNED_SHORT, 0));
    wdebug(gl.bindTexture(gl.TEXTURE_2D, gl.textures[0]));

    /*---------------------------------------------------------------*/
    wdebug(gl.useProgram(gl.shaderProgram2));

    wdebug(gl.uniformMatrix4fv(gl.shaderProgram2.pMatrixUniform, false, gl.pMatrix));
    wdebug(gl.uniformMatrix4fv(gl.shaderProgram2.mvMatrixUniform, false, gl.mvMatrix));

    // Set image dimensions uniform
    wdebug(gl.uniform2fv(gl.shaderProgram2.imageDimensionsUniform, gl.imageDimensions));
    //wdebug(gl.bindTexture(gl.TEXTURE_2D, gl.textureId));
    //wdebug(gl.activeTexture(gl.TEXTURE0));
    var sampler2D_loc = gl.getUniformLocation(gl.shaderProgram2, "texture_diffuse");

    wdebug(gl.uniform1i(sampler2D_loc, 0));

    // Bind vertex data and set vertex attributes (as from a VAO)
    //wdebug(gl.bindBuffer(gl.ARRAY_BUFFER, gl.vboId));
    a = k1xa;
    b = k1ya;
    c = k2xa;
    d = k2ya;
    e = k3xa;
    f = k3ya;

    wdebug(gl.uniform1fv(gl.shaderProgram2.k1x, new Float32Array([a])));
    wdebug(gl.uniform1fv(gl.shaderProgram2.k1y, new Float32Array([b])));
    wdebug(gl.uniform1fv(gl.shaderProgram2.k2x, new Float32Array([c])));
    wdebug(gl.uniform1fv(gl.shaderProgram2.k2y, new Float32Array([d])));
    wdebug(gl.uniform1fv(gl.shaderProgram2.k3x, new Float32Array([e])));
    wdebug(gl.uniform1fv(gl.shaderProgram2.k3y, new Float32Array([f])));
    wdebug(gl.bindFramebuffer(gl.FRAMEBUFFER, gl.FBOs[1]));
    wdebug(gl.vertexAttribPointer(gl.shaderProgram2.inPosition, 4, gl.FLOAT, false, 10 * 4, 0));
    wdebug(gl.vertexAttribPointer(gl.shaderProgram2.inColor, 4, gl.FLOAT, false, 10 * 4, 4 * 4));

    wdebug(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.vboiId));
    wdebug(gl.vertexAttribPointer(gl.shaderProgram2.inTextureCoord, 2, gl.FLOAT, false, 10 * 4, 8 * 4));

    wdebug(gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT));
    wdebug(gl.drawElements(gl.TRIANGLES, gl.indices_count, gl.UNSIGNED_SHORT, 0));
    wdebug(gl.bindTexture(gl.TEXTURE_2D, gl.textures[1]));


    wdebug(gl.bindFramebuffer(gl.FRAMEBUFFER, null));

    wdebug(gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT));
    wdebug(gl.drawElements(gl.TRIANGLES, gl.indices_count, gl.UNSIGNED_SHORT, 0));
    gl.pixels = new Uint8Array(gl.textureId.image.width * gl.textureId.image.height * 4);
    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, gl.pixels);
    wdebug(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null));
    wdebug(gl.bindBuffer(gl.ARRAY_BUFFER, null));
    wdebug(gl.bindTexture(gl.TEXTURE_2D, null));
}
function drawJudge(gl) {

    wdebug(gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight));

    if (textureIsSafeToRender == false) {
        console.log("Still can't render stuff if the texture hasn't been loaded yet");
        return;
    }
    wdebug(gl.bindBuffer(gl.ARRAY_BUFFER, gl.vboId));
    wdebug(gl.useProgram(gl.shaderProgram));


    wdebug(gl.vertexAttribPointer(gl.shaderProgram.inPosition, 4, gl.FLOAT, false, 10 * 4, 0));
    wdebug(gl.vertexAttribPointer(gl.shaderProgram.inColor, 4, gl.FLOAT, false, 10 * 4, 4 * 4));
    wdebug(gl.vertexAttribPointer(gl.shaderProgram.inTextureCoord, 2, gl.FLOAT, false, 10 * 4, 8 * 4));

    wdebug(gl.activeTexture(gl.TEXTURE0));
    wdebug(gl.bindTexture(gl.TEXTURE_2D, gl.compareTexture));

    wdebug(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.vboiId));
    // Set image dimensions uniform

    //var sampler2D_loc = gl.getUniformLocation(gl.shaderProgram, "texture");

    //wdebug(gl.uniform1i(sampler2D_loc, 0));
    wdebug(gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT));
    wdebug(gl.drawElements(gl.TRIANGLES, gl.indices_count, gl.UNSIGNED_SHORT, 0));

    // Bind vertex data and set vertex attributes (as from a VAO)
    //
    wdebug(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null));
    wdebug(gl.bindBuffer(gl.ARRAY_BUFFER, null));
    wdebug(gl.bindTexture(gl.TEXTURE_2D, null));
}
function initCompareTexture(igl) {
    var texture;
    texture = igl.createTexture();
    igl.compareTexture = texture;
}

function createTexture(igl, array) {

    igl.activeTexture(igl.TEXTURE0);
    igl.bindTexture(igl.TEXTURE_2D, igl.compareTexture);

    wdebug(igl.texImage2D(
        igl.TEXTURE_2D, 0, igl.RGBA, 256, 256, 0, igl.RGBA,
        igl.UNSIGNED_BYTE, new Uint8Array(array)
    ));
    if (igl.init) {
        wdebug(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_WRAP_S, igl.CLAMP_TO_EDGE));
        wdebug(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_WRAP_T, igl.CLAMP_TO_EDGE));
        wdebug(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_MIN_FILTER, igl.LINEAR));
        wdebug(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_MAG_FILTER, igl.LINEAR));
        igl.init = false;
    }
}

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

