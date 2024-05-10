
export type BaseData = {
    ticks: number;
    fontSize: number;
};

export type DVDRectangle = {
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

export type StatusText = {
    baseData: BaseData;
    dvdRectangle: DVDRectangle;
};
