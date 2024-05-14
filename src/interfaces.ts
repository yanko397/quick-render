import { Printable } from "@elements";

export interface Shape {
    draw(ctx: CanvasRenderingContext2D): void;
    // contains(point: Point): boolean;
    // move(dx: number, dy: number): void;
    // resize(dw: number, dh: number): void;
    // rotate(angle: number): void;
    // scale(factor: number): void;
    // translate(dx: number, dy: number): void;
}

export interface Dot extends Shape, Printable {
    options: {
        pos: () => Point;
        radius: number;
        color: string;
        speed: () => number;
    };
};

export interface Area extends Shape, Printable {
    options: {
        pos: () => Point;
        width: number;
        height: number;
    };
};

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

export interface Trailable {
    options: {
        pos: () => Point,
        width?: number,
        height?: number
        color?: string;
    };
};

export interface Point {
    x: number;
    y: number;
};
