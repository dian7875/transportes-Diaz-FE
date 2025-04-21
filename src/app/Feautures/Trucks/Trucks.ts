export interface Truck {
  plate: string;
  name: string;
}

export interface TruckResponse {
  data: Truck[];
  count: number;
}
