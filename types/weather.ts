export interface WeatherData<T> {
  success: string;
  result: Result;
  records: T;
}

export interface WeatherError {
  statusCode: number;
  statusMessage: string;
}

export interface WeatherRecords {
  Locations: RecordsLocation[];
}

export interface RecordsLocation {
  DatasetDescription: string;
  LocationsName: string;
  Dataid: string;
  Location: LocationLocation[];
}

export interface LocationLocation {
  LocationName: string;
  Geocode: string;
  Latitude: string;
  Longitude: string;
  WeatherElement: WeatherElement[];
}

export interface WeatherElement {
  ElementName: ElementName;
  Time: Time[];
}

export enum ElementName {
  The12小時降雨機率 = '12小時降雨機率',
  天氣現象 = '天氣現象',
  天氣預報綜合描述 = '天氣預報綜合描述',
  平均溫度 = '平均溫度',
  // 平均相對濕度 = '平均相對濕度',
  // 平均露點溫度 = '平均露點溫度',
  最低溫度 = '最低溫度',
  最低體感溫度 = '最低體感溫度',
  // 最大舒適度指數 = '最大舒適度指數',
  // 最小舒適度指數 = '最小舒適度指數',
  最高溫度 = '最高溫度',
  最高體感溫度 = '最高體感溫度',
  紫外線指數 = '紫外線指數',
  // 風向 = '風向',
  // 風速 = '風速',
  溫度 = '溫度',
  降雨機率 = '降雨機率',
  The3小時降雨機率 = '3小時降雨機率',
  體感溫度 = '體感溫度',
}

export interface Time {
  StartTime?: Date;
  EndTime?: Date;
  DataTime?: Date;
  ElementValue: ElementValue[];
}

export interface ElementValue {
  Temperature?: string;
  MaxTemperature?: string;
  MinTemperature?: string;
  DewPoint?: string;
  RelativeHumidity?: string;
  MaxApparentTemperature?: string;
  MinApparentTemperature?: string;
  MaxComfortIndex?: string;
  MaxComfortIndexDescription?: ComfortIndexDescription;
  MinComfortIndex?: string;
  MinComfortIndexDescription?: ComfortIndexDescription;
  WindSpeed?: string;
  BeaufortScale?: string;
  WindDirection?: WindDirection;
  ProbabilityOfPrecipitation?: string;
  Weather?: Weather;
  WeatherCode?: string;
  UVIndex?: string;
  UVExposureLevel?: UVExposureLevel;
  WeatherDescription?: string;
  ApparentTemperature?: string;
}

export enum ComfortIndexDescription {
  寒冷 = '寒冷',
  悶熱 = '悶熱',
  稍有寒意 = '稍有寒意',
  舒適 = '舒適',
  非常寒冷 = '非常寒冷',
}

export enum UVExposureLevel {
  '中量級' = 0,
  '低量級' = 1,
  '過量級' = 2,
  '高量級' = 3,
}

export enum Weather {
  '多雲' = 0,
  '多雲時晴' = 1,
  '多雲時陰' = 2,
  '多雲時陰短暫陣雨或雷雨' = 3,
  '多雲時陰短暫雨' = 4,
  '多雲短暫陣雨或雷雨' = 5,
  '多雲短暫雨' = 6,
  '晴時多雲' = 7,
  '陰天' = 8,
  '陰時多雲' = 9,
  '陰時多雲短暫陣雨或雷雨' = 10,
  '陰時多雲短暫雨' = 11,
  '陰短暫陣雨或雷雨' = 12,
  '陰短暫雨' = 13,
}

export enum WindDirection {
  偏北風 = '偏北風',
  偏南風 = '偏南風',
  偏東風 = '偏東風',
  偏西風 = '偏西風',
  東北風 = '東北風',
  東南風 = '東南風',
  西北風 = '西北風',
  西南風 = '西南風',
}

export interface Result {
  resource_id: string;
  fields: Field[];
}

export interface Field {
  id: string;
  type: Type;
}

export enum Type {
  String = 'String',
  Timestamp = 'Timestamp',
}
