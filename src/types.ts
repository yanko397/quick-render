
export type BaseData = {
    ticks: number;
    fontSize: number;
    width: () => number;
    height: () => number;
    ratio: () => number;
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

export type StatusText = {
    baseData: BaseData;
    dvdLogo: DVDLogo;
};
