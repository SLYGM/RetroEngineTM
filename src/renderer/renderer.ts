const { glMatrix, mat4, vec3 } = require('gl-matrix');

let viewport = {
    x: 0,
    y: 0,
    height: 256,
    width: 256,
}

let v_shader_source = `#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_matrix;

out vec2 v_texcoord;

void main() {
  gl_Position = u_matrix * a_position;
  v_texcoord = a_texcoord;
}
`;

let f_shader_source = `#version 300 es
precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
   outColor = texture(u_texture, v_texcoord);
}
`;
glMatrix.setMatrixArrayType(Array);


type Sprite = {
    x: number;
    y: number;
    tex: TexInfo;
}

type Updatable = {
    update: (dt: number) => void;
}

let sprites: Sprite[] = [];
let update_queue: Updatable[] = [];

function createSprite(x: number, y: number, image_path: string): Sprite {
    let tex = loadTextureFromImage(gl, image_path);
    let sprite = {
        x: x,
        y: y,
        tex: tex
    };
    sprites.push(sprite);
    return sprite;
}

function addToUpdateQueue(object: Updatable) {
    update_queue.push(object);
}

let gl: WebGL2RenderingContext;
let program: WebGLProgram;
let mat_loc: WebGLUniformLocation;
let tex_loc: WebGLUniformLocation;
let vao: WebGLVertexArrayObject;

let rendering = false;

function init() {
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) {
        return log("Failed to get webgl2 context");
    }

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    program = programFromSources(gl, v_shader_source, f_shader_source);
    if (!program) {
        return log("Failed to create program");
    }
    
    mat_loc = gl.getUniformLocation(program, "u_matrix");
    tex_loc = gl.getUniformLocation(program, "u_texture");
    
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    
    setupUnitQuad(gl, program);
}

function update(dt: number) {
    update_queue.forEach(function(object){
        object.update(dt);
    });
}

function draw() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    sprites.forEach(function(sprite){
        drawImage(
            sprite.tex.texture,
            sprite.tex.width,
            sprite.tex.height,
            sprite.x,
            sprite.y
        );
    })
}


let then = 0;
function render(time: number) {
    let now = time * 0.001;
    let dt = Math.min(0.1, now - then);
    then = now;

    update(dt);
    draw();

    if (rendering){
        requestAnimationFrame(render);
    }
}



function drawImage(tex: WebGLTexture, texWidth: number, texHeight: number, dstX: number, dstY: number) {
    gl.useProgram(program);

    gl.bindVertexArray(vao);

    let textureUnit = 0;
    gl.uniform1i(tex_loc, textureUnit);

    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, tex);

    let matrix = mat4.create();
    
    // use orthographic projection to scale coords to -1->1
    mat4.ortho(matrix, 0, viewport.width, viewport.height, 0, -1, 1);
    
    mat4.translate(matrix, matrix, vec3.fromValues(dstX, dstY, 0));
    mat4.translate(matrix, matrix, vec3.fromValues(-viewport.x, -viewport.y, 0));
    mat4.scale(matrix, matrix, vec3.fromValues(texWidth, texHeight, 1));

    gl.uniformMatrix4fv(mat_loc, false, matrix);

    let offset = 0;
    let count = 6;
    gl.drawArrays(gl.TRIANGLES, offset, count);
}


function begin_rendering() {
    rendering = true;
    requestAnimationFrame(render);
}

function stop_rendering() {
    rendering = false;
}

init();
