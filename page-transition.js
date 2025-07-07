document.addEventListener("DOMContentLoaded", function () {
  const transitionContainer = document.createElement("div");
  transitionContainer.className = "transition-container";

  const canvas = document.createElement("canvas");
  canvas.id = "transition-canvas";
  transitionContainer.appendChild(canvas);
  document.body.appendChild(transitionContainer);

  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) {
    console.error("WebGL not supported");
    return;
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  // Vertex shader - simple pass-through
  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = a_position * 0.5 + 0.5;
    }
  `;

  // Fragment shader - cosmic portal transition effect
  const fragmentShaderSource = `
    precision highp float;
    varying vec2 v_texCoord;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_progress;
    
    #define PI 3.14159265359
    #define TWO_PI 6.28318530718
    
    // Noise functions
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    
    // Simplex noise
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                          -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    // Rotation function
    mat2 rotate2d(float angle) {
      return mat2(cos(angle), -sin(angle),
                  sin(angle), cos(angle));
    }
    
    // Fractional Brownian Motion
    float fbm(vec2 p, int octaves, float lacunarity, float gain) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for (int i = 0; i < 8; i++) {
        if (i >= octaves) break;
        value += amplitude * snoise(p * frequency);
        frequency *= lacunarity;
        amplitude *= gain;
      }
      
      return value;
    }
    
    // Colorful gradient
    vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
      return a + b * cos(TWO_PI * (c * t + d));
    }
    
    // Distance field for a circle
    float sdCircle(vec2 p, float r) {
      return length(p) - r;
    }
    
    // Smooth minimum function
    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }
    
    void main() {
      // Normalized coordinates
      vec2 uv = v_texCoord;
      vec2 center = vec2(0.5);
      vec2 p = uv - center;
      
      // Aspect ratio correction
      p.x *= u_resolution.x / u_resolution.y;
      
      // Time variables
      float time = u_time * 0.5;
      float progress = u_progress;
      
      // Apply smooth easing to progress
      float smoothProgress = progress * progress * (3.0 - 2.0 * progress);
      
      // Portal effect parameters
      float portalRadius = 0.2 + smoothProgress * 0.6;
      float portalEdgeSize = 0.1 * (1.0 - smoothProgress);
      float portalGlow = 0.2 + 0.3 * (1.0 - smoothProgress);
      
      // Rotate and distort coordinates for dynamic effect
      p = rotate2d(time * 0.2) * p;
      
      // Create portal distortion
      float distortionStrength = 0.1 * (1.0 - smoothProgress);
      float distortion = fbm(p + time * 0.3, 4, 2.0, 0.5) * distortionStrength;
      
      // Create spiral effect
      float angle = atan(p.y, p.x);
      float spiral = sin(angle * 8.0 + time * 3.0 + length(p) * 10.0) * 0.05;
      
      // Calculate distance to portal edge with distortion
      float dist = sdCircle(p, portalRadius + distortion + spiral);
      
      // Create portal edge glow
      float edgeGlow = smoothstep(-portalEdgeSize, 0.0, dist) * 
                       smoothstep(portalEdgeSize, 0.0, dist);
      
      // Create inner portal swirl
      vec2 swirledUV = p;
      float swirl = 4.0 + 2.0 * smoothProgress;
      float swirledDist = length(swirledUV);
      float swirledAngle = atan(swirledUV.y, swirledUV.x) + swirledDist * swirl - time * 2.0;
      swirledUV = swirledDist * vec2(cos(swirledAngle), sin(swirledAngle));
      
      // Generate cosmic colors
      vec3 portalColor = palette(
        length(swirledUV) * 0.5 + time * 0.1,
        vec3(0.5, 0.5, 0.5),
        vec3(0.5, 0.5, 0.5),
        vec3(1.0, 1.0, 1.0),
        vec3(0.0, 0.33, 0.67)
      );
      
      // Add stars inside portal
      vec2 starCoord = swirledUV * 10.0;
      float starNoise = fbm(starCoord + time, 3, 2.0, 0.5);
      float stars = smoothstep(0.6, 0.7, starNoise) * smoothstep(-0.1, 0.0, dist);
      
      // Create outer glow
      float outerGlow = smoothstep(portalGlow, 0.0, abs(dist)) * 0.5;
      
      // Create final color
      vec3 finalColor = vec3(0.0);
      
      // Inside portal
      if (dist < 0.0) {
        finalColor = portalColor + stars;
        finalColor += edgeGlow * vec3(0.5, 0.8, 1.0) * 2.0;
      } 
      // Portal edge
      else {
        finalColor = edgeGlow * vec3(0.5, 0.8, 1.0) * 2.0;
      }
      
      // Add outer glow
      finalColor += outerGlow * vec3(0.2, 0.5, 1.0);
      
      // Vignette effect
      float vignette = 1.0 - smoothstep(0.0, 1.5, length(v_texCoord - 0.5) * 2.0);
      finalColor *= vignette;
      
      // Transition alpha
      float alpha = smoothstep(0.0, 0.2, smoothProgress) * (1.0 - smoothstep(0.8, 1.0, smoothProgress));
      if (dist < 0.0) {
        alpha = 1.0;
      } else {
        alpha *= (1.0 - smoothstep(0.0, portalGlow, abs(dist)));
      }
      
      // Output final color with alpha for transition
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program linking error:", gl.getProgramInfoLog(program));
    return;
  }

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const timeUniformLocation = gl.getUniformLocation(program, "u_time");
  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );
  const progressUniformLocation = gl.getUniformLocation(program, "u_progress");

  // Animation variables
  let startTime = null;
  let isTransitioning = false;
  let targetUrl = "";
  const transitionDuration = 2500; // ms - longer for more dramatic effect
  let animationFrameId = null;

  function setupNavLinks() {
    const navLinks = document.querySelectorAll(".navbar-link");

    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        if (window.location.href !== this.href) {
          e.preventDefault();
          targetUrl = this.href;
          startTransition();
        }
      });
    });

    const linkItems = document.querySelectorAll(".link-item");

    linkItems.forEach((link) => {
      link.addEventListener("click", function (e) {
        if (
          window.location.href !== this.href &&
          !this.href.includes("identikit2")
        ) {
          e.preventDefault();
          targetUrl = this.href;
          startTransition();
        }
      });
    });

    const backButtons = document.querySelectorAll(".back-button");

    backButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        targetUrl = this.href;
        startTransition();
      });
    });
  }

  function startTransition() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    const clickSound = document.getElementById("clickSound");
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch((e) => {
      });
    }

    transitionContainer.style.removeProperty("opacity");
    transitionContainer.classList.add("active");

    document.body.style.overflow = "hidden";

    setTimeout(() => {
      isTransitioning = true;
      startTime = Date.now();
      animationFrameId = requestAnimationFrame(render);
    }, 50);
  }

  function render() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;

    const rawProgress = Math.min(elapsedTime / transitionDuration, 1.0);
    let progress;

    if (rawProgress < 0.5) {
      progress = 2 * rawProgress * rawProgress;
    } else {
      progress = -1 + (4 - 2 * rawProgress) * rawProgress;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.uniform1f(timeUniformLocation, currentTime / 1000.0);
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    gl.uniform1f(progressUniformLocation, progress);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (isTransitioning && rawProgress < 1.0) {
      animationFrameId = requestAnimationFrame(render);
    } else if (isTransitioning) {
      setTimeout(() => {
        document.body.style.overflow = "";
        window.location.href = targetUrl;
      }, 150);
    }
  }

  setupNavLinks();
});
