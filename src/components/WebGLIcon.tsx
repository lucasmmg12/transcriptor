'use client';

import { useEffect, useRef } from 'react';

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaders = [
  // 0. Información fragmentada (Red shatter/noise)
  `
    precision mediump float;
    uniform float u_time;
    varying vec2 v_uv;
    
    // 2D Random
    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    // 2D Noise based on Morgan McGuire @morgan3d
    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 uv = v_uv * 2.0 - 1.0;
      float dist = length(uv);
      
      // Hex/grid fragmentation
      vec2 grid = floor(uv * 8.0 + u_time);
      float n = random(grid + floor(u_time * 2.0) * 0.1);
      
      vec3 color1 = vec3(0.8, 0.1, 0.1); // Bright red
      vec3 color2 = vec3(0.2, 0.0, 0.0); // Dark red
      
      vec3 finalColor = mix(color2, color1, n * smoothstep(1.0, 0.2, dist));
      
      float alpha = smoothstep(0.95, 0.85, dist);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
  // 1. Doble carga (Merging blobs)
  `
    precision mediump float;
    uniform float u_time;
    varying vec2 v_uv;

    void main() {
      vec2 uv = v_uv * 2.0 - 1.0;
      
      vec2 center1 = vec2(sin(u_time * 1.5) * 0.3, cos(u_time * 1.2) * 0.3);
      vec2 center2 = vec2(sin(u_time * 1.3 + 3.14) * 0.3, cos(u_time * 1.7 + 3.14) * 0.3);
      
      float d1 = length(uv - center1);
      float d2 = length(uv - center2);
      
      // Metaball effect
      float v = 0.05 / d1 + 0.05 / d2;
      
      vec3 color1 = vec3(0.9, 0.1, 0.1);
      vec3 color2 = vec3(0.4, 0.0, 0.0);
      
      float mask = smoothstep(0.4, 0.5, v);
      vec3 finalColor = mix(color2, color1, mask);
      
      float dist = length(uv);
      float alpha = smoothstep(0.95, 0.85, dist) * mask;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
  // 2. Ceguera gerencial (Radar/sweeping fog)
  `
    precision mediump float;
    uniform float u_time;
    varying vec2 v_uv;

    void main() {
      vec2 uv = v_uv * 2.0 - 1.0;
      float dist = length(uv);
      
      float angle = atan(uv.y, uv.x);
      // Sweeping radar
      float sweep = fract((angle + u_time * 2.0) / 6.28318);
      
      float fog = sin(dist * 10.0 - u_time * 3.0) * 0.5 + 0.5;
      
      float intensity = smoothstep(0.8, 1.0, sweep) * smoothstep(0.8, 0.0, dist);
      intensity += fog * 0.2;
      
      vec3 color1 = vec3(1.0, 0.2, 0.2);
      vec3 color2 = vec3(0.1, 0.0, 0.0);
      
      vec3 finalColor = mix(color2, color1, intensity);
      
      float alpha = smoothstep(0.95, 0.85, dist);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
  // 3. Errores tardíos (Pulsing/Glitching warning)
  `
    precision mediump float;
    uniform float u_time;
    varying vec2 v_uv;
    
    float random(float n) { return fract(sin(n) * 43758.5453123); }

    void main() {
      vec2 uv = v_uv * 2.0 - 1.0;
      
      // Glitch offset
      float t = floor(u_time * 15.0);
      if (random(t) > 0.8) {
         uv.x += (random(t + 1.0) - 0.5) * 0.2;
         uv.y += (random(t + 2.0) - 0.5) * 0.2;
      }
      
      float dist = length(uv);
      float pulse = sin(u_time * 5.0) * 0.5 + 0.5;
      
      // Expanding rings
      float ring = fract(dist * 3.0 - u_time * 2.0);
      ring = smoothstep(0.5, 0.8, ring) * smoothstep(1.0, 0.8, ring);
      
      vec3 color1 = vec3(1.0, 0.0, 0.0);
      vec3 color2 = vec3(0.2, 0.0, 0.0);
      
      vec3 finalColor = mix(color2, color1, ring * pulse + smoothstep(0.8, 0.2, dist) * 0.3);
      
      float alpha = smoothstep(0.95, 0.85, dist);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
];

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function WebGLIcon({ type = 0, className = "" }: { type?: number, className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) return;

    // Use modulo to wrap around if type is larger than our array
    const fragSource = fragmentShaders[type % fragmentShaders.length];

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // A square covering the whole canvas
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const timeUniformLocation = gl.getUniformLocation(program, "u_time");

    let animationFrameId: number;
    let startTime = Date.now();

    const render = () => {
      // Setup canvas size
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
      
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0); // Transparent background
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeUniformLocation, (Date.now() - startTime) / 1000.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [type]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`block ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
