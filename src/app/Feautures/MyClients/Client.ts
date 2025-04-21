export interface Client {
  id:number
  name: string;
}

export interface ClientResponse {
  data: Client[];
  count: number;
}
