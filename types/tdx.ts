export interface TdxTokenResponse {
  access_token: string;
  expires_in: number;
  'not-before-policy': number;
  refresh_expires_in: number;
  scope: string;
  token_type: string;
}

export interface TdxToken extends TdxTokenResponse {
  token_fetched_at: number;
}

export interface FetchTDX<T> {
  statusCode: number;
  data?: T;
  message?: string;
}

export interface CityData {
  CityID: string;
  CityName: string;
  CityCode: string;
  City: string;
  CountyID: string;
  Version: string;
  bike: boolean;
  latlng: number[];
}

export enum BikeServiceType {
  'YouBike1.0' = 1,
  'YouBike2.0' = 2,
  'Moovo' = 3,
}

export interface BikeStations {
  StationUID: string;
  StationID: string;
  AuthorityID: string;
  StationName: Station;
  StationPosition: StationPosition;
  StationAddress: Station;
  BikesCapacity: number;
  ServiceType: BikeServiceType;
  SrcUpdateTime: Date;
  UpdateTime: Date;
  isFavor?: boolean;
}

export interface Station {
  Zh_tw: string;
  En: string;
}

export interface StationPosition {
  PositionLon: number;
  PositionLat: number;
  GeoHash: string;
}

export enum BikeServiceStatus {
  '停止營運' = 0,
  '正常營運' = 1,
  '暫停營運' = 2,
}

export interface BikeAvailability {
  StationUID: string;
  StationID: string;
  ServiceStatus: BikeServiceStatus;
  ServiceType: BikeServiceType;
  AvailableRentBikes: number;
  AvailableReturnBikes: number;
  SrcUpdateTime: Date;
  UpdateTime: Date;
  AvailableRentBikesDetail: AvailableRentBikesDetail;
}

export interface AvailableRentBikesDetail {
  GeneralBikes: number;
  ElectricBikes: number;
}

export interface BikeStationWithAvailability extends BikeStations {
  availability: BikeAvailability;
}
