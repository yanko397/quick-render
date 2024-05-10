
export type BaseData = {
    time: number;
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
    size: number;
};

export type StatusText = {
    baseData: BaseData;
    dvdRectangle: DVDRectangle;
};
