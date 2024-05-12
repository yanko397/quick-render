export interface BaseData {
    tick: number;
    fontSize: number;
    width: () => number;
    height: () => number;
    ratio: () => number;
    // contains trails of objects etc.
    overlay: () => ImageData;
};

export interface StatusEntry {
    name: string;
    value: string | number;
    extra?: string;
};

interface Printable {
    entries?: StatusEntry[];
};

export interface Area {
    pos: Point,
    width: number,
    height: number,
};

export interface Trailable {
    pos: Point,
    width?: number,
    height?: number
    color?: string;
};

export interface Point {
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
    speed: () => number;
    trail?: Trail;
};

export interface CircleDot extends Dot {
    circleCenter: () => Point;
    circleRadius: () => number;
    direction: 'clockwise' | 'counter-clockwise';
};

export interface ChaserDot extends Dot {
    target?: () => Point;
};

export interface Trail extends Printable {
    pos: Point;
    color: { r: number, g: number, b: number, a: number };
};

export interface DVDLogo extends Area, Printable {
    right: boolean;
    down: boolean;
    baseSpeed: number;
    currentSpeed?: () => number;
    boostRatio: number;
    image?: HTMLImageElement;
};
