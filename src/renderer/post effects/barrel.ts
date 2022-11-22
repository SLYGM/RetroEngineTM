import { _gl } from '../gl.js';

import { PostProcess } from "../post_process.js";


export default class BarrelShader extends PostProcess {
    constructor() {
        const v_shader = `#version 300 es

        in vec4 a_position;
        in vec2 a_texcoord;

        out vec2 v_texcoord;

        void main() {
            // the screen coordinates are in the range [-1, 1], whereas the unit quad is in the range [0, 1]
            gl_Position = a_position * vec4(2, 2, 1, 1) - vec4(1, 1, 0, 0);
            v_texcoord = a_texcoord;
        }
        `;
        //https://clemz.io/article-retro-shaders-webgl.html
        const f_shader = `#version 300 es

        precision highp float;
        uniform sampler2D u_texture;
        in vec2 v_texcoord;

        out vec4 outColour;

        void main()
        {
            vec2 pos = v_texcoord;
            float distortion = 0.2; 
            pos -= vec2(0.5, 0.5);
            pos *= vec2(pow(length(pos), distortion));
            pos += vec2(0.5, 0.5);
            outColour = texture(u_texture, pos);
        }
        `
        super(v_shader, f_shader);
    }
}