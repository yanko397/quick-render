export type BaseData = {
    ticks: number;
    fontSize: number;
    width: () => number;
    height: () => number;
    ratio: () => number;
};

export type StatusText = {
    baseData: BaseData;
    dvdLogo: DVDLogo;
};

export type Circle = {
    center: () => { x: number; y: number };
    radius: () => number;
    color: string;
    lineWidth: number;
};

export type CircleDot = {
    x?: number;
    y?: number;
    radius: number;
    circleCenter: () => { x: number; y: number };
    circleRadius: () => number;
    color: string;
    speed: number;
    right: boolean;
};

export type ChaserDot = {
    x: number;
    y: number;
    radius: number;
    color: string;
    speed: number;
    target: CircleDot;
};

export type DVDLogo = {
    x: number;
    y: number;
    right: boolean;
    down: boolean;
    baseSpeed: number;
    currentSpeed?: number;
    boostRatio: number;
    width: number;
    height: number;
    image?: HTMLImageElement;
};
