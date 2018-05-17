var gl; // gl instance
// add by dicarne
var gl2;
var glt;
var gl3;
var glcom;
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
    webGLStart_inside(gl);
    webGLStart_inside(gl2);
    webGLStart_inside(glt);
    webGLStart_inside(gl3);
    setupQuad(glcom);
    initCompareShader(glcom);
    initCompareTexture(glcom);
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

function initCompareShader(igl) {
    var vertexShader = getShader(igl, "simple-vs");
    var frag_compare_shader = getShader(igl, "simple-fs");
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram = igl.createProgram());
    ctx = WebGLDebugUtils.makeDebugContext(igl.attachShader(igl.shaderProgram, vertexShader));
    ctx = WebGLDebugUtils.makeDebugContext(igl.attachShader(igl.shaderProgram, frag_compare_shader));
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

}

function initShaders(igl) {

    var fragmentShader = getShader(igl, "shader-fs");
    var vertexShader = getShader(igl, "shader-vs");
    var fragmentShader2 = getShader(igl, "shader2-fs");
    //var frag_compare_shader = getShader(igl, "compare-fs");

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
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram.k3x = igl.getUniformLocation(igl.shaderProgram, "k3x"));
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram.k3y = igl.getUniformLocation(igl.shaderProgram, "k3y"));
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
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram2.k3x = igl.getUniformLocation(igl.shaderProgram2, "k3x"));
    ctx = WebGLDebugUtils.makeDebugContext(igl.shaderProgram2.k3y = igl.getUniformLocation(igl.shaderProgram2, "k3y"));

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
        ctx = WebGLDebugUtils.makeDebugContext(igl.bufferData(igl.ARRAY_BUFFER, new Float32Array(full_vbo_data), igl.STATIC_DRAW));
    else
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
    igl.textureId.image.src = "assets/testchildsmall.png";
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
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram.alphax, new Float32Array([a])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram.alphay, new Float32Array([b])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram.k2x, new Float32Array([c])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram.k2y, new Float32Array([d])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram.k3x, new Float32Array([e])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram.k3y, new Float32Array([f])));
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
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram2.alphax, new Float32Array([a])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram2.alphay, new Float32Array([b])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram2.k2x, new Float32Array([c])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram2.k2y, new Float32Array([d])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram2.k3x, new Float32Array([e])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1fv(gl.shaderProgram2.k3y, new Float32Array([f])));
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindFramebuffer(gl.FRAMEBUFFER, gl.FBOs[1]));
    ctx = WebGLDebugUtils.makeDebugContext(gl.vertexAttribPointer(gl.shaderProgram2.inPosition, 4, gl.FLOAT, false, 10 * 4, 0));
    ctx = WebGLDebugUtils.makeDebugContext(gl.vertexAttribPointer(gl.shaderProgram2.inColor, 4, gl.FLOAT, false, 10 * 4, 4 * 4));

    ctx = WebGLDebugUtils.makeDebugContext(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.vboiId));
    ctx = WebGLDebugUtils.makeDebugContext(gl.vertexAttribPointer(gl.shaderProgram2.inTextureCoord, 2, gl.FLOAT, false, 10 * 4, 8 * 4));

    ctx = WebGLDebugUtils.makeDebugContext(gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT));
    ctx = WebGLDebugUtils.makeDebugContext(gl.drawElements(gl.TRIANGLES, gl.indices_count, gl.UNSIGNED_SHORT, 0));
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindTexture(gl.TEXTURE_2D, gl.textures[1]));


    ctx = WebGLDebugUtils.makeDebugContext(gl.bindFramebuffer(gl.FRAMEBUFFER, null));

    ctx = WebGLDebugUtils.makeDebugContext(gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT));
    ctx = WebGLDebugUtils.makeDebugContext(gl.drawElements(gl.TRIANGLES, gl.indices_count, gl.UNSIGNED_SHORT, 0));
    gl.pixels = new Uint8Array(gl.textureId.image.width * gl.textureId.image.height * 4);
    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, gl.pixels);
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null));
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindBuffer(gl.ARRAY_BUFFER, null));
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindTexture(gl.TEXTURE_2D, null));
}

function drawJudge(gl) {

    ctx = WebGLDebugUtils.makeDebugContext(gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight));

    if (textureIsSafeToRender == false) {
        console.log("Still can't render stuff if the texture hasn't been loaded yet");
        return;
    }
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindBuffer(gl.ARRAY_BUFFER, gl.vboId));
    ctx = WebGLDebugUtils.makeDebugContext(gl.useProgram(gl.shaderProgram));

    
    ctx = WebGLDebugUtils.makeDebugContext(gl.vertexAttribPointer(gl.shaderProgram.inPosition, 4, gl.FLOAT, false, 10 * 4, 0));
    ctx = WebGLDebugUtils.makeDebugContext(gl.vertexAttribPointer(gl.shaderProgram.inColor, 4, gl.FLOAT, false, 10 * 4, 4 * 4));
    ctx = WebGLDebugUtils.makeDebugContext(gl.vertexAttribPointer(gl.shaderProgram.inTextureCoord, 2, gl.FLOAT, false, 10 * 4, 8 * 4));

    ctx = WebGLDebugUtils.makeDebugContext(gl.activeTexture(gl.TEXTURE0));
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindTexture(gl.TEXTURE_2D, gl.compareTexture));

    ctx = WebGLDebugUtils.makeDebugContext(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.vboiId));
    // Set image dimensions uniform

    //var sampler2D_loc = gl.getUniformLocation(gl.shaderProgram, "texture");

    //ctx = WebGLDebugUtils.makeDebugContext(gl.uniform1i(sampler2D_loc, 0));
    ctx = WebGLDebugUtils.makeDebugContext(gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT));
    ctx = WebGLDebugUtils.makeDebugContext(gl.drawElements(gl.TRIANGLES, gl.indices_count, gl.UNSIGNED_SHORT, 0));

    // Bind vertex data and set vertex attributes (as from a VAO)
    //
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null));
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindBuffer(gl.ARRAY_BUFFER, null));
    ctx = WebGLDebugUtils.makeDebugContext(gl.bindTexture(gl.TEXTURE_2D, null));
}
function initCompareTexture(igl) {
    var texture;
    texture = igl.createTexture();
    igl.compareTexture = texture;
}
var init = true;
function createTexture(igl, array) {

    igl.activeTexture(igl.TEXTURE0);
    igl.bindTexture(igl.TEXTURE_2D, igl.compareTexture);

    ctx = WebGLDebugUtils.makeDebugContext(igl.texImage2D(
        igl.TEXTURE_2D, 0, igl.RGBA, 256, 256, 0, igl.RGBA,
        igl.UNSIGNED_BYTE, new Uint8Array(array)
    ));
    if (init) {
        ctx = WebGLDebugUtils.makeDebugContext(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_WRAP_S, igl.CLAMP_TO_EDGE));
        ctx = WebGLDebugUtils.makeDebugContext(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_WRAP_T, igl.CLAMP_TO_EDGE));
        ctx = WebGLDebugUtils.makeDebugContext(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_MIN_FILTER, igl.LINEAR));
        ctx = WebGLDebugUtils.makeDebugContext(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_MAG_FILTER, igl.LINEAR));
        init = false;
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
            /*
            compare.data[i] = Math.abs(gl2.pixels[i] - gl3.pixels[i]);
            compare.data[i + 1] = Math.abs(gl2.pixels[i + 1] - gl3.pixels[i + 1]);
            compare.data[i + 2] = Math.abs(gl2.pixels[i + 2] - gl3.pixels[i + 2]);*/
            compare.data[i + 3] = 255;
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

var same_alpha_factors = true; // Whether alphax and alphay are forced to be equal
//var same_alpha_factors2 = true;
function adjustAlphaFactor(direction, value) {
    switch (direction) {
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
function study() {
    console.log('start study!');
    showing = false;
}
var scale = 50;

function trainAll() {
    //console.log('trainning');
    if (isFirstTime) {
        loss = red_predict();;
        trainCount = 0;
        isFirstTime = false;
        scale = 50;
    }
    trainCount++;
    lastValue.k1 = k1xa;
    lastValue.k2 = k2xa;
    lastValue.k3 = k3xa;
    function normal(value) {
        return (value * 0.01) * maximum_alpha
    }
    function denormal(value) {
        return value / 0.01 / maximum_alpha;
    }

    var ch1 = (Math.random() - 0.5) * 50 + denormal(lastValue.k1);
    var ch2 = (Math.random() - 0.5) * 50 + denormal(lastValue.k2);
    var ch3 = (Math.random() - 0.5) * 50 + denormal(lastValue.k3);

    adjustAlphaFactor('k1a', ch1);
    adjustAlphaFactor('k2a', ch2);
    adjustAlphaFactor('k3a', ch3);

    drawScene(gl2);
    //drawScene(gl3);
    var loss2 = red_predict();
    //console.log(loss2);
    if (loss2 < loss) {
        //console.log('success');
        Judge();
        lastValue.k1 = k1xa;
        lastValue.k2 = k2xa;
        lastValue.k3 = k3xa;
        loss = loss2;
    } else {
        //console.log('roll back');
        k1xa = lastValue.k1;
        k2xa = lastValue.k2;
        k3xa = lastValue.k3;
    }
    adjustAlphaFactor('k1a', denormal(k1xa));
    adjustAlphaFactor('k2a', denormal(k2xa));
    adjustAlphaFactor('k3a', denormal(k3xa));

}

function train1() {
    //console.log('trainning');
    if (isFirstTime) {
        console.log('train start');
        loss = red_predict();;
        trainCount = 0;
        isFirstTime = false;
        showing = false;
        scale = 50;
    }
    trainCount++;
    lastValue.k1 = k1xa;

    var ch1 = (Math.random() - 0.5) * 50 + denormal(lastValue.k1);

    adjustAlphaFactor('k1a', ch1);

    drawScene(gl2);
    //drawScene(gl3);
    var loss2 = red_predict();
    //console.log(loss2);
    if (loss2 < loss) {
        //console.log('success');
        Judge();
        lastValue.k1 = k1xa;
        loss = loss2;
    } else {
        //console.log('roll back');
        k1xa = lastValue.k1;
    }
    adjustAlphaFactor('k1a', denormal(k1xa));

}

function train2() {

    trainCount++;
    lastValue.k2 = k2xa;

    var ch2 = (Math.random() - 0.5) * 50 + denormal(lastValue.k2);

    adjustAlphaFactor('k2a', ch2);

    drawScene(gl2);
    //drawScene(gl3);
    var loss2 = red_predict();
    //console.log(loss2);
    if (loss2 < loss) {
        //console.log('success');
        Judge();
        lastValue.k2 = k2xa;
        loss = loss2;
    } else {
        //console.log('roll back');
        k2xa = lastValue.k2;
    }
    adjustAlphaFactor('k2a', denormal(k2xa));

}

function train3() {

    trainCount++;
    lastValue.k3 = k3xa;

    var ch3 = (Math.random() - 0.5) * 50 + denormal(lastValue.k3);

    adjustAlphaFactor('k3a', ch3);

    drawScene(gl2);
    //drawScene(gl3);
    var loss2 = red_predict();
    //console.log(loss2);
    if (loss2 < loss) {
        //console.log('success');
        Judge();
        lastValue.k3 = k3xa;
        loss = loss2;
    } else {
        //console.log('roll back');
        k3xa = lastValue.k3;
    }
    adjustAlphaFactor('k3a', denormal(k3xa));

}

function normal(value) {
    return (value * 0.01) * maximum_alpha
}
function denormal(value) {
    return value / 0.01 / maximum_alpha;
}