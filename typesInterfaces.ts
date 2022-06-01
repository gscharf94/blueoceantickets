export type Position = {
  lat: number,
  lng: number,
}

export type Response = {
  utility_name: string,
  utility_type: string,
  response: string,
  contact: string,
  alternate_contact: string,
  emergency_contact: string,
  notes: string,
}

export interface TicketInfo {
  ticket_number: string,
  city: string,
  street: string,
  cross_street: string,
  input_date: Date,
  expiration_date: Date,
  job_name: string,
  pl_number: number,
  description: string,
  responses: Response[],
  coordinates?: Position[],
}