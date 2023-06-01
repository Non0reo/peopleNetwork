#define maxI 50

precision highp float;

varying vec2 vTexCoord; // 0.0 - 1.0
        //gl_FragCoord  // 0.0 - maxPixel

uniform vec2 u_resolution;
uniform vec2 u_zoom;
uniform vec2 u_pan;

float map(float n, float start1, float stop1, float start2, float stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

void main() {

    //vec2 coord = vTexCoord;
    vec2 pixel = gl_FragCoord.xy;
    
    vec2 pos = vec2(
        map(pixel.x, 0., u_resolution.x * 2.0, u_zoom.x, u_zoom.y) + u_pan.x,
        map(pixel.y, 0., u_resolution.y * 2.0, u_zoom.x, u_zoom.y) + u_pan.y
    );

    vec2 cPos = pos;
    int _n = 0;

    for(int n = 0; n < maxI; n++) {
        vec2 newPos = vec2(
            pos.x * pos.x - pos.y * pos.y,
            2.0 * pos.x * pos.y
        );
        pos = newPos + cPos;
        if(pos.x * pos.x - pos.y * pos.y > 16.0) break;
        _n = n;
    }
    float bright = map(float(_n), 0.0, float(maxI), 0.0, 1.0);
    bright = map(sqrt(bright), 0., 1., 0., 255.);
    bright = map(bright, 0., 255., 0., 1.0);
    if (_n == maxI) bright = 0.0;
    
    gl_FragColor = vec4(vec3(bright), 1.0);
}