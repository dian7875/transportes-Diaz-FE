
export  interface Driver {
  id: number;
  name: string;
  startDate: Date;
  endDate?: Date;
  status: boolean;
}

export  interface DriverResponse {
  data: Driver[];
  count: number;
}
