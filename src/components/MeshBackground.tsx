import { useEffect, useRef } from 'react';

const AURA_SETTINGS = {
  ribbon1_thickness: 0.090,
  ribbon2_thickness: 0.110,
  ribbon3_thickness: 0.075,
  ribbon4_thickness: 0.065,
  thickness_variation: 0.046,
  edge_sharpness: 0.060,
  grain_scale1: 1.450,
  grain_scale2: 0.800,
  grain_scale3: 0.430,
  grain_intensity: 0.800,
  fbm_scale: 2.700,
  fbm_speed: 0.410,
  fbm_intensity: 0.700,
  mouse_push_strength: 0.120,
  mouse_push_radius: 4.000,
  mouse_flow_influence: 0.150,
  mouse_smoothing: 0.060,
  glow_intensity: 0.650,
  glow_radius: 13.500,
  wave_amplitude: 0.085,
  wave_speed: 0.200,
  color_dark: [0.5, 0.02, 0.0],
  color_red: [0.92, 0.1, 0.02],
  color_orange: [1.0, 0.35, 0.1],
  color_hot: [1.0, 0.65, 0.4],
  color_white: [1.0, 0.9, 0.8],
};

const vsSource = `attribute vec2 a_pos; void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const fsSource = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

uniform float u_ribbon1_thick;
uniform float u_ribbon2_thick;
uniform float u_ribbon3_thick;
uniform float u_ribbon4_thick;
uniform float u_thick_var;
uniform float u_edge_sharp;
uniform float u_grain_scale1;
uniform float u_grain_scale2;
uniform float u_grain_scale3;
uniform float u_grain_intensity;
uniform float u_fbm_scale;
uniform float u_fbm_intensity;
uniform float u_mouse_push;
uniform float u_mouse_radius;
uniform float u_mouse_flow;
uniform float u_glow_intensity;
uniform float u_glow_radius;
uniform float u_wave_amp;
uniform vec3 u_col1;
uniform vec3 u_col2;
uniform vec3 u_col3;
uniform vec3 u_col4;
uniform vec3 u_col5;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
        v += a * snoise(p);
        p = rot * p * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float sdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

vec2 catmull(vec2 p0, vec2 p1, vec2 p2, vec2 p3, float t) {
    float t2 = t * t;
    float t3 = t2 * t;
    return 0.5 * (
        (2.0 * p1) +
        (-p0 + p2) * t +
        (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t2 +
        (-p0 + 3.0 * p1 - 3.0 * p2 + p3) * t3
    );
}

float sdSplineSeg(vec2 p, vec2 c0, vec2 c1, vec2 c2, vec2 c3) {
    float minD = 1e9;
    vec2 prev = c1;
    for (int i = 1; i <= 10; i++) {
        float t = float(i) / 10.0;
        vec2 curr = catmull(c0, c1, c2, c3, t);
        minD = min(minD, sdSegment(p, prev, curr));
        prev = curr;
    }
    return minD;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    float aspect = u_res.x / u_res.y;
    vec2 p = uv;
    p.x *= aspect;
    
    vec2 m = u_mouse;
    m.x *= aspect;
    
    float t = u_time;
    
    float mouseDist = length(p - m);
    float mouseInfluence = exp(-mouseDist * u_mouse_radius) * u_mouse_flow;
    
    vec2 q = vec2(0.0);
    q.x = fbm(p * u_fbm_scale + t * 0.1);
    q.y = fbm(p * u_fbm_scale + vec2(5.2, 1.3) + t * 0.12);
    
    vec2 r = vec2(0.0);
    r.x = fbm(p * u_fbm_scale + 4.0 * q + vec2(1.7, 9.2) + t * 0.15 + mouseInfluence * 5.0);
    r.y = fbm(p * u_fbm_scale + 4.0 * q + vec2(8.3, 2.8) + t * 0.13);
    
    float f = fbm(p * u_fbm_scale + 3.0 * r + mouseInfluence * 3.0);
    
    // RIBBON 1
    vec2 r1[7];
    r1[0] = vec2(-0.15, 0.92 + sin(t * 1.0) * u_wave_amp);
    r1[1] = vec2(0.20, 0.75 + sin(t * 1.2 + 1.0) * u_wave_amp * 1.5);
    r1[2] = vec2(0.45, 0.60 + cos(t * 1.1) * u_wave_amp * 1.2);
    r1[3] = vec2(0.70 * aspect, 0.50 + sin(t * 1.0 + 0.5) * u_wave_amp * 1.3);
    r1[4] = vec2(0.88 * aspect, 0.42 + cos(t * 1.2) * u_wave_amp);
    r1[5] = vec2(1.05 * aspect, 0.35 + sin(t * 0.9 + 2.0) * u_wave_amp);
    r1[6] = vec2(1.3 * aspect, 0.30);
    
    for (int i = 0; i < 7; i++) {
        vec2 dir = r1[i] - m;
        float d = length(dir);
        r1[i] += normalize(dir + 0.001) * exp(-d * u_mouse_radius) * u_mouse_push;
    }
    
    float d1 = 1e9;
    d1 = min(d1, sdSplineSeg(p, r1[0], r1[0], r1[1], r1[2]));
    d1 = min(d1, sdSplineSeg(p, r1[0], r1[1], r1[2], r1[3]));
    d1 = min(d1, sdSplineSeg(p, r1[1], r1[2], r1[3], r1[4]));
    d1 = min(d1, sdSplineSeg(p, r1[2], r1[3], r1[4], r1[5]));
    d1 = min(d1, sdSplineSeg(p, r1[3], r1[4], r1[5], r1[6]));
    d1 = min(d1, sdSplineSeg(p, r1[4], r1[5], r1[6], r1[6]));
    
    // RIBBON 2
    vec2 r2[6];
    r2[0] = vec2(-0.05, 0.70 + sin(t * 1.2 + 1.5) * u_wave_amp * 0.8);
    r2[1] = vec2(0.28, 0.52 + cos(t * 1.1 + 0.8) * u_wave_amp * 1.2);
    r2[2] = vec2(0.55 * aspect, 0.38 + sin(t * 1.0 + 1.2) * u_wave_amp);
    r2[3] = vec2(0.78 * aspect, 0.30 + cos(t * 1.2 + 0.3) * u_wave_amp * 1.3);
    r2[4] = vec2(0.96 * aspect, 0.25 + sin(t * 0.9) * u_wave_amp * 0.8);
    r2[5] = vec2(1.2 * aspect, 0.18);
    
    for (int i = 0; i < 6; i++) {
        vec2 dir = r2[i] - m;
        float d = length(dir);
        r2[i] += normalize(dir + 0.001) * exp(-d * u_mouse_radius) * u_mouse_push * 0.85;
    }
    
    float d2 = 1e9;
    d2 = min(d2, sdSplineSeg(p, r2[0], r2[0], r2[1], r2[2]));
    d2 = min(d2, sdSplineSeg(p, r2[0], r2[1], r2[2], r2[3]));
    d2 = min(d2, sdSplineSeg(p, r2[1], r2[2], r2[3], r2[4]));
    d2 = min(d2, sdSplineSeg(p, r2[2], r2[3], r2[4], r2[5]));
    d2 = min(d2, sdSplineSeg(p, r2[3], r2[4], r2[5], r2[5]));
    
    // RIBBON 3
    vec2 r3[6];
    r3[0] = vec2(-0.10, 0.35 + sin(t * 0.9 + 2.0) * u_wave_amp);
    r3[1] = vec2(0.22, 0.28 + cos(t * 1.0 + 1.5) * u_wave_amp * 1.3);
    r3[2] = vec2(0.50 * aspect, 0.18 + sin(t * 1.1 + 0.5) * u_wave_amp);
    r3[3] = vec2(0.75 * aspect, 0.25 + cos(t * 0.95 + 1.0) * u_wave_amp * 1.2);
    r3[4] = vec2(0.95 * aspect, 0.32 + sin(t * 1.15) * u_wave_amp * 0.9);
    r3[5] = vec2(1.25 * aspect, 0.28);
    
    for (int i = 0; i < 6; i++) {
        vec2 dir = r3[i] - m;
        float d = length(dir);
        r3[i] += normalize(dir + 0.001) * exp(-d * u_mouse_radius) * u_mouse_push * 0.9;
    }
    
    float d3 = 1e9;
    d3 = min(d3, sdSplineSeg(p, r3[0], r3[0], r3[1], r3[2]));
    d3 = min(d3, sdSplineSeg(p, r3[0], r3[1], r3[2], r3[3]));
    d3 = min(d3, sdSplineSeg(p, r3[1], r3[2], r3[3], r3[4]));
    d3 = min(d3, sdSplineSeg(p, r3[2], r3[3], r3[4], r3[5]));
    d3 = min(d3, sdSplineSeg(p, r3[3], r3[4], r3[5], r3[5]));
    
    // RIBBON 4
    vec2 r4[7];
    r4[0] = vec2(-0.12, 0.12 + sin(t * 1.1 + 0.8) * u_wave_amp * 0.7);
    r4[1] = vec2(0.18, 0.08 + cos(t * 0.9 + 1.2) * u_wave_amp);
    r4[2] = vec2(0.42, 0.15 + sin(t * 1.0 + 0.3) * u_wave_amp * 1.1);
    r4[3] = vec2(0.65 * aspect, 0.10 + cos(t * 1.2) * u_wave_amp * 0.9);
    r4[4] = vec2(0.82 * aspect, 0.05 + sin(t * 0.85 + 1.8) * u_wave_amp);
    r4[5] = vec2(1.0 * aspect, 0.12 + cos(t * 1.05 + 0.5) * u_wave_amp * 0.8);
    r4[6] = vec2(1.3 * aspect, 0.08);
    
    for (int i = 0; i < 7; i++) {
        vec2 dir = r4[i] - m;
        float d = length(dir);
        r4[i] += normalize(dir + 0.001) * exp(-d * u_mouse_radius) * u_mouse_push * 0.8;
    }
    
    float d4 = 1e9;
    d4 = min(d4, sdSplineSeg(p, r4[0], r4[0], r4[1], r4[2]));
    d4 = min(d4, sdSplineSeg(p, r4[0], r4[1], r4[2], r4[3]));
    d4 = min(d4, sdSplineSeg(p, r4[1], r4[2], r4[3], r4[4]));
    d4 = min(d4, sdSplineSeg(p, r4[2], r4[3], r4[4], r4[5]));
    d4 = min(d4, sdSplineSeg(p, r4[3], r4[4], r4[5], r4[6]));
    d4 = min(d4, sdSplineSeg(p, r4[4], r4[5], r4[6], r4[6]));
    
    // COMBINE RIBBONS
    float thick1 = u_ribbon1_thick + f * u_thick_var;
    float thick2 = u_ribbon2_thick + f * u_thick_var * 0.8;
    float thick3 = u_ribbon3_thick + f * u_thick_var * 0.9;
    float thick4 = u_ribbon4_thick + f * u_thick_var * 0.7;
    
    float ribbon1 = smoothstep(thick1, thick1 * u_edge_sharp, d1);
    float ribbon2 = smoothstep(thick2, thick2 * u_edge_sharp, d2);
    float ribbon3 = smoothstep(thick3, thick3 * u_edge_sharp, d3);
    float ribbon4 = smoothstep(thick4, thick4 * u_edge_sharp, d4);
    
    float ribbonMask = max(max(ribbon1, ribbon2 * 0.95), max(ribbon3 * 0.9, ribbon4 * 0.85));
    
    float detail = snoise(gl_FragCoord.xy * u_grain_scale1) * 0.5 + 0.5;
    detail *= snoise(gl_FragCoord.xy * u_grain_scale2 + t * 8.0) * 0.4 + 0.6;
    detail *= snoise(gl_FragCoord.xy * u_grain_scale3 + f * 2.0) * 0.3 + 0.7;
    
    float flowIntensity = f * 0.5 + 0.5;
    flowIntensity = pow(flowIntensity, 0.7);
    
    float grainMix = 0.6 + detail * u_grain_intensity;
    float intensity = ribbonMask * (0.5 + flowIntensity * u_fbm_intensity) * grainMix;
    
    float core = pow(ribbonMask, 2.0);
    intensity = mix(intensity, ribbonMask * 1.1, core * 0.5);
    
    vec3 ribbonColor = u_col1;
    ribbonColor = mix(ribbonColor, u_col2, smoothstep(0.0, 0.2, intensity));
    ribbonColor = mix(ribbonColor, u_col3, smoothstep(0.2, 0.4, intensity));
    ribbonColor = mix(ribbonColor, u_col4, smoothstep(0.4, 0.65, intensity));
    ribbonColor = mix(ribbonColor, u_col5, smoothstep(0.65, 0.95, intensity));
    
    float glow1 = exp(-d1 * u_glow_radius) * u_glow_intensity;
    float glow2 = exp(-d2 * u_glow_radius) * u_glow_intensity * 0.85;
    float glow3 = exp(-d3 * u_glow_radius) * u_glow_intensity * 0.80;
    float glow4 = exp(-d4 * u_glow_radius) * u_glow_intensity * 0.70;
    float glow = max(max(glow1, glow2), max(glow3, glow4));
    
    vec3 bg = vec3(0.045, 0.04, 0.04);
    float mouseGlow = exp(-mouseDist * 3.5) * 0.08;
    bg += vec3(0.3, 0.04, 0.0) * mouseGlow;
    
    vec3 col = bg;
    col += vec3(0.35, 0.04, 0.0) * glow;
    col += ribbonColor * intensity;
    
    gl_FragColor = vec4(col, 1.0);
}
`;

const MeshBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const mouseRef = useRef({ x: 0.5, y: 0.5, smoothX: 0.5, smoothY: 0.5 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;
    glRef.current = gl;

    // Create shaders
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    
    gl.useProgram(program);
    programRef.current = program;

    // Create buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Get uniforms
    uniformsRef.current = {
      res: gl.getUniformLocation(program, 'u_res'),
      time: gl.getUniformLocation(program, 'u_time'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
      ribbon1_thick: gl.getUniformLocation(program, 'u_ribbon1_thick'),
      ribbon2_thick: gl.getUniformLocation(program, 'u_ribbon2_thick'),
      ribbon3_thick: gl.getUniformLocation(program, 'u_ribbon3_thick'),
      ribbon4_thick: gl.getUniformLocation(program, 'u_ribbon4_thick'),
      thick_var: gl.getUniformLocation(program, 'u_thick_var'),
      edge_sharp: gl.getUniformLocation(program, 'u_edge_sharp'),
      grain_scale1: gl.getUniformLocation(program, 'u_grain_scale1'),
      grain_scale2: gl.getUniformLocation(program, 'u_grain_scale2'),
      grain_scale3: gl.getUniformLocation(program, 'u_grain_scale3'),
      grain_intensity: gl.getUniformLocation(program, 'u_grain_intensity'),
      fbm_scale: gl.getUniformLocation(program, 'u_fbm_scale'),
      fbm_intensity: gl.getUniformLocation(program, 'u_fbm_intensity'),
      mouse_push: gl.getUniformLocation(program, 'u_mouse_push'),
      mouse_radius: gl.getUniformLocation(program, 'u_mouse_radius'),
      mouse_flow: gl.getUniformLocation(program, 'u_mouse_flow'),
      glow_intensity: gl.getUniformLocation(program, 'u_glow_intensity'),
      glow_radius: gl.getUniformLocation(program, 'u_glow_radius'),
      wave_amp: gl.getUniformLocation(program, 'u_wave_amp'),
      col1: gl.getUniformLocation(program, 'u_col1'),
      col2: gl.getUniformLocation(program, 'u_col2'),
      col3: gl.getUniformLocation(program, 'u_col3'),
      col4: gl.getUniformLocation(program, 'u_col4'),
      col5: gl.getUniformLocation(program, 'u_col5'),
    };

    // Resize handler
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    // Render loop
    const render = (time: number) => {
      const mouse = mouseRef.current;
      mouse.smoothX += (mouse.x - mouse.smoothX) * AURA_SETTINGS.mouse_smoothing;
      mouse.smoothY += (mouse.y - mouse.smoothY) * AURA_SETTINGS.mouse_smoothing;

      const u = uniformsRef.current;
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, time * 0.001 * AURA_SETTINGS.fbm_speed);
      gl.uniform2f(u.mouse, mouse.smoothX, 1.0 - mouse.smoothY);
      
      gl.uniform1f(u.ribbon1_thick, AURA_SETTINGS.ribbon1_thickness);
      gl.uniform1f(u.ribbon2_thick, AURA_SETTINGS.ribbon2_thickness);
      gl.uniform1f(u.ribbon3_thick, AURA_SETTINGS.ribbon3_thickness);
      gl.uniform1f(u.ribbon4_thick, AURA_SETTINGS.ribbon4_thickness);
      gl.uniform1f(u.thick_var, AURA_SETTINGS.thickness_variation);
      gl.uniform1f(u.edge_sharp, AURA_SETTINGS.edge_sharpness);
      gl.uniform1f(u.grain_scale1, AURA_SETTINGS.grain_scale1);
      gl.uniform1f(u.grain_scale2, AURA_SETTINGS.grain_scale2);
      gl.uniform1f(u.grain_scale3, AURA_SETTINGS.grain_scale3);
      gl.uniform1f(u.grain_intensity, AURA_SETTINGS.grain_intensity);
      gl.uniform1f(u.fbm_scale, AURA_SETTINGS.fbm_scale);
      gl.uniform1f(u.fbm_intensity, AURA_SETTINGS.fbm_intensity);
      gl.uniform1f(u.mouse_push, AURA_SETTINGS.mouse_push_strength);
      gl.uniform1f(u.mouse_radius, AURA_SETTINGS.mouse_push_radius);
      gl.uniform1f(u.mouse_flow, AURA_SETTINGS.mouse_flow_influence);
      gl.uniform1f(u.glow_intensity, AURA_SETTINGS.glow_intensity);
      gl.uniform1f(u.glow_radius, AURA_SETTINGS.glow_radius);
      gl.uniform1f(u.wave_amp, AURA_SETTINGS.wave_amplitude);
      
      gl.uniform3fv(u.col1, AURA_SETTINGS.color_dark);
      gl.uniform3fv(u.col2, AURA_SETTINGS.color_red);
      gl.uniform3fv(u.col3, AURA_SETTINGS.color_orange);
      gl.uniform3fv(u.col4, AURA_SETTINGS.color_hot);
      gl.uniform3fv(u.col5, AURA_SETTINGS.color_white);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationRef.current = requestAnimationFrame(render);
    };

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current.x = e.touches[0].clientX / window.innerWidth;
        mouseRef.current.y = e.touches[0].clientY / window.innerHeight;
      }
    };

    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);

    resize();
    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default MeshBackground;
