/**
 * Created by MIC on 2015/10/6.
 */

"use strict";

/**
 * @type {HTMLCanvasElement}
 */
var canvas = document.getElementById("canvas");
/**
 * @type {WebGLRenderingContext}
 */
var glc = canvas.getContext("webgl", {antialias: 1, alpha: 1, depth: 1});
var gl = WebGLRenderingContext;

/**
 * @type {Number[]}
 */
var verticesAndColorsArray = [
    0.0, 50.0, 1.0, 0.0, 0.0,
    -50.0, -50.0, 1.0, 0.0, 0.0,
    -50.0, -50.0, 0.0, 1.0, 0.0,
    50.0, -50.0, 0.0, 1.0, 0.0,
    50.0, -50.0, 0.0, 0.0, 1.0,
    0.0, 50.0, 0.0, 0.0, 1.0
];

/**
 * @param {WebGLRenderingContext} glc
 * @param {String} vsid
 * @param {String} fsid
 * @returns {Boolean}
 */
function initShaders(glc, vsid, fsid) {
    var vssource = getShaderSource(vsid);
    var fssource = getShaderSource(fsid);
    var program = createProgram(glc, vssource, fssource);
    if (!program) {
        console.log("Failed to create program.");
        return false;
    }
    glc.useProgram(program);
    glc.program = program;
    return true;

    /**
     * @param {WebGLRenderingContext} glc
     * @param {String} vshader
     * @param {String} fshader
     * @returns {WebGLProgram}
     */
    function createProgram(glc, vshader, fshader) {
        var vertexShader = loadShader(glc, gl.VERTEX_SHADER, vshader);
        var fragmentShader = loadShader(glc, gl.FRAGMENT_SHADER, fshader);
        if (!vertexShader || !fragmentShader) {
            return null;
        }
        var program = glc.createProgram();
        if (!program) {
            return null;
        }
        glc.attachShader(program, vertexShader);
        glc.attachShader(program, fragmentShader);
        glc.linkProgram(program);
        var linked = glc.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            var errorLog = glc.getProgramInfoLog(program);
            console.log("Failed to link program: " + errorLog);
            glc.deleteProgram(program);
            glc.deleteShader(vertexShader);
            glc.deleteShader(fragmentShader);
            return null;
        }
        return program;
    }

    /**
     * @param {String} id
     * @returns {String}
     */
    function getShaderSource(id) {
        /**
         * @type {HTMLElement}
         */
        var elem = document.getElementById(id);
        return elem.textContent;
    }

    /**
     * @param {WebGLRenderingContext} glc
     * @param {Number} type
     * @param {String} source
     * @returns {WebGLShader}
     */
    function loadShader(glc, type, source) {
        var shader = glc.createShader(type);
        if (shader === null) {
            console.log("Unable to create shader.");
            return null;
        }
        glc.shaderSource(shader, source);
        glc.compileShader(shader);
        var isCompiled = glc.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!isCompiled) {
            var errorLog = glc.getShaderInfoLog(shader);
            console.log("Failed to compile shader: " + errorLog);
            glc.deleteShader(shader);
            return null;
        }
        return shader;
    }
}

/**
 * @param {WebGLRenderingContext} glc
 * @returns {Number}
 */
function initVertexBuffers(glc) {
    /**
     * @type {Float32Array}
     */
    var verticesAndColors = new Float32Array(verticesAndColorsArray);
    /**
     * @type {Number}
     */
    var n = verticesAndColorsArray.length / 5;

    var vertexColorBuffer = glc.createBuffer();
    if (!vertexColorBuffer) {
        console.log("Failed to create the buffer object.");
        return 0;
    }
    glc.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    glc.bufferData(gl.ARRAY_BUFFER, verticesAndColors, gl.STATIC_DRAW);
    /**
     * @type {Number}
     */
    var FSIZE = Float32Array.BYTES_PER_ELEMENT;
    var a_Position = glc.getAttribLocation(glc.program, "a_Position");
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    glc.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    glc.enableVertexAttribArray(a_Position);
    var a_Color = glc.getAttribLocation(glc.program, "a_Color");
    if (a_Color < 0) {
        console.log("Failed to get the storage location of a_Color");
        return -1;
    }
    glc.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    glc.enableVertexAttribArray(a_Color);
    glc.bindBuffer(gl.ARRAY_BUFFER, null);
    return n;
}

/**
 * @param {WebGLRenderingContext} glc
 */
function clearCanvas(glc) {
    glc.clearColor(0, 0, 0, 0);
    glc.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

/**
 * @param {WebGLRenderingContext} glc
 */
function drawLines(glc) {
    /**
     * @type {Number}
     */
    var n;
    if ((n = initVertexBuffers(glc)) <= 0) {
        console.log("Failed to initialize vertex buffers.");
        return;
    }
    clearCanvas(glc);
    glc.drawArrays(gl.LINES, 0, n);
}

function main() {
    if (!initShaders(glc, "vshader-color", "fshader-color")) {
        console.log("Failed to intialize shaders.");
        return;
    }

    glc.lineWidth(5);

    var u_ProjMatrix = glc.getUniformLocation(glc.program, "u_ProjMatrix");
    if (!u_ProjMatrix) {
        console.log("Failed to get the storage location of u_ProjMatrix.");
        return;
    }
    var projMatrix = new Matrix4();
    projMatrix.setOrtho(-canvas.width / 2, canvas.width / 2, -canvas.height / 2, canvas.height / 2, 0, 1000);
    glc.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    drawLines(glc);

    canvas.addEventListener("mousemove", canvasOnMouseMove);
}

/**
 * @param {MouseEvent} ev
 */
function canvasOnMouseMove(ev) {
    if (ev.ctrlKey) {
        // x, y, r, g, b
        var arr = [0, 0, 0, 0, 0];
        var lastArr = [0, 0, 0, 0, 0];
        var len = verticesAndColorsArray.length;
        lastArr[0] = verticesAndColorsArray[len - 1 - 4];
        lastArr[1] = verticesAndColorsArray[len - 1 - 3];
        for (var i = 0; i < 3; i++) {
            arr[i + 2] = Math.random();
            lastArr[i + 2] = arr[i + 2];
        }
        arr[0] = ev.offsetX - canvas.width / 2;
        arr[1] = -(ev.offsetY - canvas.height / 2);
        verticesAndColorsArray = verticesAndColorsArray.concat(lastArr).concat(arr);
        drawLines(glc);
    }
}

main();
