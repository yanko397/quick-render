export interface BaseData {
    tick: number;
    fontSize: number;
    width: () => number;
    height: () => number;
    ratio: () => number;
};

export interface StatusEntry {
    name: string;
    value: string | number;
    extra?: string;
};

interface Printable {
    entries?: StatusEntry[];
};

interface Point {
    x: number;
    y: number;
};

export interface Circle extends Printable {
    center: () => Point;
    radius: () => number;
    color: string;
    lineWidth: number;
};

interface Dot extends Printable {
    pos: Point;
    radius: number;
    color: string;
    speed: number;
    trail?: Trail;
};

export interface CircleDot extends Dot {
    circleCenter: () => Point;
    circleRadius: () => number;
    direction: 'clockwise' | 'counter-clockwise';
};

export interface ChaserDot extends Dot {
    target?: Point;
};

export interface Trail extends Printable {
    points: Point[];
    maxLength: number;
    radius: number;
    color: string;
};

export interface DVDLogo extends Printable {
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
