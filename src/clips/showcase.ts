/**
 * Showcase Clip
 * 
 * This clip demonstrates the animation system's capabilities:
 * - Multiple easing types (elastic, bounce, cubic, back)
 * - Parallel transitions (simultaneous animations)
 * - Color interpolation with tween_colour
 * - globalAlpha fades
 * - Staggered/sequential element animations
 * - Various motion patterns
 */

import Transition from '../lib/transition';
import { fill, dot, colour_change } from '../lib/crab';
import type { Clip, Dimensions, Colours, Assets, ITransition } from '../types';

const dimensions: Dimensions = [1200, 630];

// No external assets needed - this is a geometric animation
const assets: Assets = {};

const colours: Colours = {
    background: '#1a1a2e',
    primary: '#16213e',
    accent1: '#0f3460',
    accent2: '#e94560',
    accent3: '#00d9ff',
    accent4: '#ff6b6b',
    accent5: '#4ecdc4',
    white: '#ffffff'
};

// Scene 1: Intro with bouncing dots
const intro_dots = (duration: number): ITransition[] => ([
    new Transition({
        duration,
        start: [0, 0, 0],
        finish: [100, dimensions[1] / 2, 5],
        ease: 'easeOutBounce',
        step: async (cx, _asset_cache, vals) => new Promise(r => {
            fill(cx, dimensions, colours['background']);
            
            // Draw bouncing dots with staggered timing
            const dotCount = 5;
            const spacing = dimensions[0] / (dotCount + 1);
            
            for (let i = 0; i < Math.min(vals[2], dotCount); i++) {
                const x = spacing * (i + 1);
                const y = dimensions[1] - vals[1] * (1 - i * 0.1);
                const radius = 20 + i * 5;
                
                cx.globalAlpha = vals[0] / 100;
                const dotColour = i % 2 === 0 ? colours['accent2'] : colours['accent3'];
                dot(cx, [x, y], radius, dotColour);
            }
            
            setTimeout(r, 10);
        })
    })
]);

// Scene 2: Elastic wave
const elastic_wave = (duration: number): ITransition[] => ([
    new Transition({
        duration,
        start: [0],
        finish: [Math.PI * 4],
        ease: 'easeOutElastic',
        step: async (cx, _asset_cache, vals) => new Promise(r => {
            fill(cx, dimensions, colours['background']);
            
            // Draw wave of circles
            const circleCount = 20;
            const spacing = dimensions[0] / circleCount;
            
            for (let i = 0; i < circleCount; i++) {
                const x = spacing * i + spacing / 2;
                const waveOffset = Math.sin(vals[0] + i * 0.5) * 100;
                const y = dimensions[1] / 2 + waveOffset;
                
                cx.globalAlpha = 0.8;
                const hue = (i / circleCount) * 360;
                cx.fillStyle = `hsl(${hue}, 70%, 60%)`;
                cx.beginPath();
                cx.arc(x, y, 15, 0, Math.PI * 2);
                cx.fill();
            }
            
            setTimeout(r, 10);
        })
    })
]);

// Scene 3: Color morph background with expanding circles
const color_morph = (duration: number): ITransition[] => ([
    new Transition({
        duration,
        start: [0, 0],
        finish: [1, Math.max(dimensions[0], dimensions[1])],
        ease: 'easeInOutCubic',
        step: async (cx, _asset_cache, vals) => new Promise(r => {
            // Interpolate background color
            const bgColor = colour_change(colours['background'], colours['accent1'], vals[0]);
            fill(cx, dimensions, bgColor);
            
            // Draw expanding circles from center
            const centerX = dimensions[0] / 2;
            const centerY = dimensions[1] / 2;
            
            for (let i = 3; i >= 0; i--) {
                const radius = vals[1] * (1 - i * 0.2);
                if (radius > 0) {
                    cx.globalAlpha = 0.3 + i * 0.15;
                    const circleColor = i % 2 === 0 ? colours['accent2'] : colours['accent3'];
                    dot(cx, [centerX, centerY], radius, circleColor);
                }
            }
            
            setTimeout(r, 10);
        })
    })
]);

// Scene 4: Parallel animations - multiple elements moving simultaneously
const parallel_entry_left = (duration: number): ITransition[] => ([
    new Transition({
        duration,
        start: [-100],
        finish: [dimensions[0] / 4],
        ease: 'easeOutBack',
        step: async (cx, _asset_cache, vals) => new Promise(r => {
            // Left element slides in
            cx.globalAlpha = 1;
            dot(cx, [vals[0], dimensions[1] / 2], 50, colours['accent4']);
            setTimeout(r, 1);
        })
    })
]);

const parallel_entry_right = (duration: number): ITransition[] => ([
    new Transition({
        duration,
        start: [dimensions[0] + 100],
        finish: [dimensions[0] * 3 / 4],
        ease: 'easeOutBack',
        step: async (cx, _asset_cache, vals) => new Promise(r => {
            // Right element slides in
            cx.globalAlpha = 1;
            dot(cx, [vals[0], dimensions[1] / 2], 50, colours['accent5']);
            setTimeout(r, 1);
        })
    })
]);

const parallel_entry_center = (duration: number): ITransition[] => ([
    new Transition({
        duration,
        start: [0, -100],
        finish: [1, dimensions[1] / 2],
        ease: 'easeOutBack',
        step: async (cx, _asset_cache, vals) => new Promise(r => {
            // Background for parallel scene
            const bg = colour_change(colours['accent1'], colours['primary'], vals[0]);
            fill(cx, dimensions, bg);
            
            // Center element drops in
            cx.globalAlpha = 1;
            dot(cx, [dimensions[0] / 2, vals[1]], 60, colours['white']);
            setTimeout(r, 1);
        })
    })
]);

// Scene 5: Staggered grid animation
const staggered_grid = (duration: number): ITransition[] => ([
    new Transition({
        duration,
        start: [0, 0],
        finish: [25, 100],
        ease: 'easeInOutQuart',
        step: async (cx, _asset_cache, vals) => new Promise(r => {
            fill(cx, dimensions, colours['primary']);
            
            const cols = 5;
            const rows = 5;
            const cellWidth = dimensions[0] / cols;
            const cellHeight = dimensions[1] / rows;
            
            let index = 0;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (index < vals[0]) {
                        const x = col * cellWidth + cellWidth / 2;
                        const y = row * cellHeight + cellHeight / 2;
                        const size = (vals[1] / 100) * 40;
                        
                        // Alternate colors in checkerboard pattern
                        const isEven = (row + col) % 2 === 0;
                        const color = isEven ? colours['accent2'] : colours['accent3'];
                        
                        cx.globalAlpha = 0.9;
                        dot(cx, [x, y], size, color);
                    }
                    index++;
                }
            }
            
            setTimeout(r, 10);
        })
    })
]);

// Scene 6: Fade out with shrinking elements
const fade_out = (duration: number): ITransition[] => ([
    new Transition({
        duration,
        start: [100, 40],
        finish: [0, 0],
        ease: 'easeInQuint',
        step: async (cx, _asset_cache, vals) => new Promise(r => {
            fill(cx, dimensions, colours['primary']);
            
            const cols = 5;
            const rows = 5;
            const cellWidth = dimensions[0] / cols;
            const cellHeight = dimensions[1] / rows;
            
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * cellWidth + cellWidth / 2;
                    const y = row * cellHeight + cellHeight / 2;
                    
                    const isEven = (row + col) % 2 === 0;
                    const color = isEven ? colours['accent2'] : colours['accent3'];
                    
                    cx.globalAlpha = vals[0] / 100;
                    dot(cx, [x, y], vals[1], color);
                }
            }
            
            setTimeout(r, 10);
        })
    })
]);

// Wait/hold transition
const wait = (delay: number): ITransition[] => ([
    new Transition({
        duration: delay,
        start: [0],
        finish: [100],
        ease: 'easeNone',
        step: async (_cx, _asset_cache, _vals) => new Promise(r => {
            setTimeout(r, 10);
        })
    })
]);

// Final scene - title card
const title_card = (duration: number): ITransition[] => ([
    new Transition({
        duration,
        start: [0, 0],
        finish: [100, 1],
        ease: 'easeOutCubic',
        step: async (cx, _asset_cache, vals) => new Promise(r => {
            const bg = colour_change(colours['primary'], colours['background'], vals[1]);
            fill(cx, dimensions, bg);
            
            cx.globalAlpha = vals[0] / 100;
            cx.fillStyle = colours['white'];
            cx.font = 'bold 72px system-ui, sans-serif';
            cx.textAlign = 'center';
            cx.textBaseline = 'middle';
            cx.fillText('Golden Retriever', dimensions[0] / 2, dimensions[1] / 2 - 40);
            
            cx.font = '32px system-ui, sans-serif';
            cx.fillStyle = colours['accent3'];
            cx.fillText('Animation Showcase', dimensions[0] / 2, dimensions[1] / 2 + 40);
            
            setTimeout(r, 10);
        })
    })
]);

const speed = 1;

const clip: Clip = {
    name: 'Showcase',
    colours,
    assets,
    dimensions,
    transitions: [
        // Scene 1: Bouncing dots intro
        intro_dots(60 * speed),
        wait(20 * speed),
        
        // Scene 2: Elastic wave animation
        elastic_wave(80 * speed),
        wait(10 * speed),
        
        // Scene 3: Color morphing with expanding circles
        color_morph(60 * speed),
        wait(20 * speed),
        
        // Scene 4: Parallel animations (all three run simultaneously!)
        [
            ...parallel_entry_center(50 * speed),
            ...parallel_entry_left(50 * speed),
            ...parallel_entry_right(50 * speed)
        ],
        wait(30 * speed),
        
        // Scene 5: Staggered grid build
        staggered_grid(80 * speed),
        wait(20 * speed),
        
        // Scene 6: Fade out
        fade_out(40 * speed),
        
        // Final: Title card
        title_card(60 * speed),
        wait(40 * speed)
    ]
};

export default clip;
