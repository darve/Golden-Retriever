import easing from './easing';
import type { AssetCache, EasingFunction, EasingName, ITransition, TransitionConfig, TransitionStepFn } from '../types';

class Transition implements ITransition {
    progress: number;
    duration: number;
    start: number[];
    finish: number[];
    ease: EasingFunction;
    step: TransitionStepFn;
    dead: boolean;
    cb?: () => void;

    constructor({ duration, start, finish, ease, step }: TransitionConfig) {
        this.progress = 0;
        this.duration = duration;
        this.start = start;
        this.finish = finish;
        this.ease = easing[ease];
        this.step = step;
        this.dead = false;
    }

    async tick(cx: CanvasRenderingContext2D, asset_cache: AssetCache): Promise<void> {
        return new Promise(async (resolve) => {
            if (this.progress >= 0) {
                const vals: number[] = [];
                this.start.forEach((val, index) => {
                    vals.push(
                        this.ease(
                            this.progress,
                            0,
                            this.finish[index] - this.start[index],
                            this.duration
                        ) + this.start[index]
                    );
                });
                await this.step(cx, asset_cache, vals);
            }

            this.progress++;

            if (this.progress === this.duration) {
                this.dead = true;
                if (this.cb) this.cb();
            }
            resolve();
        });
    }
}

export default Transition;
