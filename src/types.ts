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

export interface Circle extends Printable{
    center: () => Point;
    radius: () => number;
    color: string;
    lineWidth: number;
};

export interface CircleDot extends Printable{
    pos: Point;
    radius: number;
    circleCenter: () => Point;
    circleRadius: () => number;
    color: string;
    speed: number;
    right: boolean;
};

export interface ChaserDot extends Printable{
    pos: Point;
    radius: number;
    color: string;
    speed: number;
    target?: Point;
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
