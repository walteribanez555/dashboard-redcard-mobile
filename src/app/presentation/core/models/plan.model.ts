export interface Plan {
  cobertura: number | null;
  moneda: Moneda | null;
  complemento: null | string;
  extra: number;
  tipo_beneficio: number;
  beneficio: string;
  incremento: number;
  color: Color | null;
  icono: Icono | null;
  beneficio_id: number;
}

export enum Color {
  The131313 = '#131313',
}

export enum Icono {
  ImgURL = 'imgUrl',
  URLImg = 'urlImg',
  Urlimg = 'urlimg',
}

export enum Moneda {
  SUS = 'Sus',
}
