export interface LensInterface {
  left: {
    sphere: number | null;
    cylinder: number | null;
    axis: number | null;
    diameter: number | null;
    productNumber: number | null;
    addition: number | null;
  };
  right: {
    sphere: number | null;
    cylinder: number | null;
    axis: number | null;
    diameter: number | null;
    productNumber: number | null;
    addition: number | null;
  };
  pupilDistance: number | null;
  baseCurve: number | null;
  lensMaterial: string | null;
  errors: string[];
}
