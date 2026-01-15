import { useState, useEffect, useRef } from 'react';
import save from '../connect/save';
import type { Clip, AssetCache, ITransition } from '../types';

function Canvas({ clip }: { clip: Clip }) {
    const { name, assets, dimensions, transitions } = clip;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameCountRef = useRef<number>(0);
    const transitionsRef = useRef<ITransition[][]>([...transitions]);

    const [ww, wh] = dimensions;
    const [cx, setCx] = useState<CanvasRenderingContext2D | null>(null);
    const [assetCache, setAssetCache] = useState<AssetCache>({});
    const [ready, setReady] = useState(false);

    // Load all assets on mount
    useEffect(() => {
        Object.keys(assets).forEach((assetKey) => {
            const assetPath = assets[assetKey];
            const extension = assetPath.split('.').pop()?.toLowerCase();

            if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
                const img = new Image();
                img.onload = () => {
                    setAssetCache((prev) => ({ ...prev, [assetKey]: img }));
                };
                img.src = assetPath;
            } else if (extension === 'mp4' || extension === 'webm') {
                const vid = document.createElement('video');
                vid.addEventListener('canplaythrough', () => {
                    setAssetCache((prev) => ({ ...prev, [assetKey]: vid }));
                }, { once: true });
                vid.src = assetPath;
            }
        });
    }, [assets]);

    // Initialize canvas context
    useEffect(() => {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                setCx(context);
            }
        }
    }, []);

    // Start animation when all assets are loaded
    useEffect(() => {
        const assetCount = Object.keys(assets).length;
        const loadedCount = Object.keys(assetCache).length;

        if (loadedCount === assetCount && !ready && cx) {
            setReady(true);
        }
    }, [assetCache, assets, ready, cx]);

    // Animation loop
    useEffect(() => {
        if (!ready || !cx || !canvasRef.current) return;

        const tick = async () => {
            const currentTransitions = transitionsRef.current;

            if (currentTransitions.length === 0) {
                console.log('Animation complete!');
                return;
            }

            const currentGroup = currentTransitions[0];

            // Run all transitions in the current group in parallel
            await Promise.all(
                currentGroup.map((transition) => transition.tick(cx, assetCache))
            );

            // Check if all transitions in this group are dead
            const allDead = currentGroup.every((t) => t.dead);
            if (allDead) {
                currentTransitions.shift();
            }

            // Save frame
            if (canvasRef.current) {
                const png = canvasRef.current.toDataURL('image/png');
                const frameNum = String('0000' + frameCountRef.current).slice(-4);
                await save.save_frame(name, frameNum, png);
                console.log(`Frame ${frameCountRef.current}`);
            }

            frameCountRef.current++;
            requestAnimationFrame(tick);
        };

        tick();
    }, [ready, cx, assetCache, name]);

    return (
        <div className="canvas-wrapper">
            <canvas
                className="gif-canvas shadow-md rounded-lg"
                ref={canvasRef}
                width={ww}
                height={wh}
            />
        </div>
    );
}

export default Canvas;
