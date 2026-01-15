
/**
 * Helpful canvas drawing functions.
 */
export const line = (cx: CanvasRenderingContext2D, start: number[], end: number[]) => {
    cx.beginPath();
    cx.moveTo(start[0], start[1]);
    cx.lineTo(end[0], end[1]);
    cx.stroke();
};

export const dot = (cx: CanvasRenderingContext2D, pos: number[], r: number, colour?: string) => {
	const [x, y] = pos;
	if (colour) {
		cx.fillStyle = colour;
	}
	cx.translate(x, y);
    cx.beginPath();
    cx.arc(0, 0, r * 2, 0, 2 * Math.PI, false);
    cx.closePath();
    cx.fill();
    cx.setTransform(1, 0, 0, 1, 0, 0);
};

export const fill = (cx: CanvasRenderingContext2D, dimensions: number[], colour: string, modifier?: number[]) => {
    cx.fillStyle = colour;
    if (!modifier) {
        cx.fillRect(0, 0, dimensions[0], dimensions[1]);
    } else {
        cx.fillRect(modifier[0], modifier[1], dimensions[0], dimensions[1]);
    }  
};

export const img_center = (cx: CanvasRenderingContext2D, dimensions: number[], img: HTMLImageElement, modifier: number[]) => {
    let { width, height } = img;
    let w2 = width/2;
    let h2 = height/2;
    cx.drawImage(img, ((dimensions[0]/2)-w2)+modifier[0], ((dimensions[1]/2)-h2)+modifier[1]);
};

export const video_center = (cx: CanvasRenderingContext2D, dimensions: number[], vid: HTMLVideoElement, modifier: number[]) => {
    
    let { videoWidth, videoHeight } = vid;
    let width = dimensions[0];
    let height = width * (videoHeight/videoWidth);
    let w2 = width/2;
    let h2 = height/2;

    cx.drawImage(vid, modifier[0], modifier[1], width, height);
};

export const img_spin = (cx: CanvasRenderingContext2D, dimensions: number[], img: HTMLImageElement, modifier: number[], rotation: number) => {

    let { width, height } = img;
    let w2 = width/2;
    let h2 = height/2;

    cx.translate(dimensions[0]/2, dimensions[1]/2);
    cx.rotate(rotation);
    cx.drawImage(img, -w2, -h2, width, height);
    cx.setTransform(1, 0, 0, 1, 0, 0);
}

export const text = (cx: CanvasRenderingContext2D, font: string, text: string, pos: number[]) => {

}

export const colour_change = (a: string, b: string, amount: number) => { 

    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

export const video_frames = (vid: HTMLVideoElement, fps: number) => {
    return Math.floor((vid.duration*1000)/fps)
}