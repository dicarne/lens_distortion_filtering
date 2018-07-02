var photoname = "checkboard.png";
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
    if (CheckFlag(igl.renderMode, Simple))
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
    igl.textureId.image.src = "assets/"+photoname;
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

    if (CheckFlag(gl.renderMode, Anti_distortion)) {
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
    if (CheckFlag(gl.renderMode, Distor)) {
        a = k1xa;
        b = k1ya;
        c = k2xa;
        d = k2ya;
        e = k3xa;
        f = k3ya;
    } else if (CheckFlag(gl.renderMode, Normal)) {
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
    e = bestk3;
    f = bestk3;



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

function initCompareTexture(igl) {
    var texture;
    texture = igl.createTexture();
    igl.compareTexture = texture;
}

function createTexture(igl, array) {

    igl.activeTexture(igl.TEXTURE0);
    igl.bindTexture(igl.TEXTURE_2D, igl.compareTexture);

    ctx = WebGLDebugUtils.makeDebugContext(igl.texImage2D(
        igl.TEXTURE_2D, 0, igl.RGBA, 256, 256, 0, igl.RGBA,
        igl.UNSIGNED_BYTE, new Uint8Array(array)
    ));
    ctx = WebGLDebugUtils.makeDebugContext(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_WRAP_S, igl.CLAMP_TO_EDGE));
    ctx = WebGLDebugUtils.makeDebugContext(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_WRAP_T, igl.CLAMP_TO_EDGE));
    ctx = WebGLDebugUtils.makeDebugContext(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_MIN_FILTER, igl.LINEAR));
    ctx = WebGLDebugUtils.makeDebugContext(igl.texParameteri(igl.TEXTURE_2D, igl.TEXTURE_MAG_FILTER, igl.LINEAR));
}
