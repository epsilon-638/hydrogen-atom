#pragma glslify: noiseFunc = require(glsl-noise/simplex/4d);

// all credit to markhorgan for the code for both the shaders

uniform float uTime;
uniform float uTimeScaleFrag;
uniform float uNoiseScaleRed;
uniform float uNoiseScaleGreen;
uniform float uNoiseScaleBlue;
varying vec3 vNormal;

void main() {
    float time = uTime * uTimeScaleFrag;
    float red = noiseFunc(vec4(vNormal * uNoiseScaleRed + 0.0, time)) + 0.5 + 0.5;
    float green = noiseFunc(vec4(vNormal * uNoiseScaleGreen + 10.0, time)) + 0.5 + 0.5;
    float blue = noiseFunc(vec4(vNormal * uNoiseScaleBlue + 20.0, time)) + 0.5 + 0.5;
    gl_FragColor = vec4(red, green, blue, 1.0);
}
