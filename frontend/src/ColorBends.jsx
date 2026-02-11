import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function BendsShader({ rotation, speed, colors, scale, frequency, warpStrength, noise }) {
  const meshRef = useRef();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(colors[0]) },
    uColor2: { value: new THREE.Color(colors[1]) },
    uColor3: { value: new THREE.Color(colors[2]) },
    uScale: { value: scale },
    uFreq: { value: frequency },
    uWarp: { value: warpStrength },
    uNoise: { value: noise }
  }), [colors, scale, frequency, warpStrength, noise]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime() * speed;
    if (meshRef.current) {
      meshRef.current.rotation.z = rotation * (Math.PI / 180);
    }
  });

  return (
    <mesh ref={meshRef} scale={[2.5, 2.5, 1]}>
      <planeGeometry args={[2, 2, 256, 256]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          uniform float uScale;
          uniform float uFreq;
          uniform float uWarp;
          uniform float uNoise;

          void main() {
            vec2 uv = vUv * uScale;
            
            // Create flowing wave patterns
            float warp = sin(uv.x * uFreq + uTime) * uWarp;
            float wave1 = sin((uv.x + warp) * uFreq + uTime);
            float wave2 = cos((uv.y + warp) * uFreq + uTime);
            
            // Combine waves
            float pattern = (wave1 + wave2) * 0.5;
            
            // Add secondary flow
            float flow = sin(uv.x * uFreq * 0.5 + uTime * 0.5) * cos(uv.y * uFreq * 0.5 - uTime * 0.3);
            
            // Normalize to 0-1 range
            float mixValue1 = (pattern + 1.0) * 0.5;
            float mixValue2 = (flow + 1.0) * 0.5;
            
            // Mix colors
            vec3 color1 = mix(uColor1, uColor2, mixValue1);
            vec3 color2 = mix(color1, uColor3, mixValue2 * 0.5);
            
            // Brighten the overall effect
            float brightness = 1.2 + sin(uTime * 0.5) * 0.3;
            vec3 finalColor = color2 * brightness;
            
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function ColorBends(props) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas 
        frameloop="always"
        camera={{ position: [0, 0, 1] }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <BendsShader {...props} />
      </Canvas>
    </div>
  );
}