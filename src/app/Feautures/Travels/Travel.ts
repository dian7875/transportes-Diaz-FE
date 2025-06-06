export interface Driver {
  id: number;
  name: string;
  startDate: string;
  endDate: string | null;
  status: boolean;
}

export interface Truck {
  plate: string;
  name: string;
}

export interface Client {
  id: number;
  name: string;
}

export interface Travel {
  id: number;
  travelCode: string;
  destination: string;
  noIVAmount: number;
  withIVAmount: number;
  IVAmount: number;
  travelDate: string;
  driver: Driver;
  truck: Truck;
  client: Client;
}
export interface Total {
  IVA: number;
  NoIVA: number;
  total: number;
}

export interface ResponseData {
  data: Travel[];
  count: number;
  total: Total;
}

export interface newTravel {
  travelCode: string;
  destination: string;
  noIVAmount: number;
  withIVAmount: number;
  travelDate: string;
  driver_id: number;
  truck_plate: string;
  client_id: number;
}
