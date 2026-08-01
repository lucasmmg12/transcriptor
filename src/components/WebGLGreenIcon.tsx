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
  // 0. Sistemas operativos (Animated Structural Grid/Network)
  `
    precision mediump float;
    uniform float u_time;
    varying vec2 v_uv;
    
    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = v_uv * 2.0 - 1.0;
      float dist = length(uv);
      
      // Moving grid
      vec2 grid = fract(uv * 4.0 - u_time * 0.5);
      float line = smoothstep(0.1, 0.0, grid.x) + smoothstep(0.9, 1.0, grid.x) +
                   smoothstep(0.1, 0.0, grid.y) + smoothstep(0.9, 1.0, grid.y);
                   
      float glow = sin(u_time * 2.0 - length(floor(uv * 4.0))) * 0.5 + 0.5;
      
      vec3 color1 = vec3(0.1, 0.8, 0.3); // Bright Green
      vec3 color2 = vec3(0.0, 0.2, 0.1); // Dark Green
      
      vec3 finalColor = mix(color2, color1, line * glow);
      
      // Mask to rounded square
      vec2 d = abs(uv) - 0.7;
      float dsq = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
      float alpha = smoothstep(0.1, 0.0, dsq);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
  // 1. Sistemas de gestión (Data stream / Chart bars)
  `
    precision mediump float;
    uniform float u_time;
    varying vec2 v_uv;

    void main() {
      vec2 uv = v_uv * 2.0 - 1.0;
      
      // Bar chart effect
      float barCount = 5.0;
      float barId = floor((uv.x + 1.0) * 0.5 * barCount);
      float barPhase = sin(barId * 13.0 + u_time * 2.0) * 0.5 + 0.5;
      
      // Animated height
      float h = barPhase * 0.8 + 0.1;
      float isBar = step(uv.y + 1.0, h * 2.0);
      
      // Gap between bars
      float gap = fract((uv.x + 1.0) * 0.5 * barCount);
      float isGap = smoothstep(0.1, 0.2, gap) * smoothstep(0.9, 0.8, gap);
      
      float mask = isBar * isGap;
      
      vec3 color1 = vec3(0.2, 1.0, 0.4);
      vec3 color2 = vec3(0.0, 0.3, 0.1);
      
      // Gradient inside bar
      vec3 finalColor = mix(color2, color1, (uv.y + 1.0) * 0.5) * mask;
      
      // Rounded square mask
      vec2 d = abs(uv) - 0.7;
      float dsq = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
      float alpha = smoothstep(0.1, 0.0, dsq);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
  // 2. Automatización e IA (Neural Network / Glowing Core)
  `
    precision mediump float;
    uniform float u_time;
    varying vec2 v_uv;

    void main() {
      vec2 uv = v_uv * 2.0 - 1.0;
      
      // Pulsing core
      float dist = length(uv);
      float core = smoothstep(0.4, 0.0, dist) * (sin(u_time * 4.0) * 0.2 + 0.8);
      
      // Orbiting particles
      float angle = atan(uv.y, uv.x);
      float particles = sin(angle * 5.0 + u_time * 3.0) * sin(dist * 15.0 - u_time * 2.0);
      particles = smoothstep(0.8, 1.0, particles) * smoothstep(0.8, 0.4, dist);
      
      float intensity = core + particles;
      
      vec3 color1 = vec3(0.0, 1.0, 0.5);
      vec3 color2 = vec3(0.0, 0.1, 0.0);
      
      vec3 finalColor = mix(color2, color1, intensity);
      
      // Rounded square mask
      vec2 d = abs(uv) - 0.7;
      float dsq = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
      float alpha = smoothstep(0.1, 0.0, dsq);
      
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

export default function WebGLGreenIcon({ type = 0, className = "" }: { type?: number, className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) return;

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
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
      
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0);
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
