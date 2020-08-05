//This file is automatically rebuilt by the Cesium build process.
export default "uniform sampler2D colorTexture;\n\
varying vec2 v_textureCoordinates;\n\
float hash(float x){\n\
return fract(sin(x*133.3)*13.13);\n\
}\n\
void main(void){\n\
float time = czm_frameNumber / 60.0;\n\
vec2 resolution = czm_viewport.zw;\n\
vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
vec3 c=vec3(.6,.7,.8);\n\
float a=-.4;\n\
float si=sin(a),co=cos(a);\n\
uv*=mat2(co,-si,si,co);\n\
uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
c*=v*b;\n\
gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);\n\
}\n\
";
