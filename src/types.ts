export type BaseData = {
    tick: number;
    fontSize: number;
    width: () => number;
    height: () => number;
    ratio: () => number;
};

export type StatusText = {
    baseData: BaseData;
    dvdLogo: DVDLogo;
};

export type Point = {
    x: number;
    y: number;
};

export type Circle = {
    center: () => Point;
    radius: () => number;
    color: string;
    lineWidth: number;
};

export type CircleDot = {
    pos: Point;
    radius: number;
    circleCenter: () => Point;
    circleRadius: () => number;
    color: string;
    speed: number;
    right: boolean;
};

export type ChaserDot = {
    pos: Point;
    radius: number;
    color: string;
    speed: number;
    target?: Point;
};

export type DVDLogo = {
    pos: Point;
    right: boolean;
    down: boolean;
    baseSpeed: number;
    currentSpeed?: number;
    boostRatio: number;
    width: number;
    height: number;
    image?: HTMLImageElement;
};
