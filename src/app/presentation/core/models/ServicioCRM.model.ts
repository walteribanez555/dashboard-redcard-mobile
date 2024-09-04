export interface ServicioCRM {
  servicio_id: number;
  servicio: string;
  descripcion: string;
  precio_base: number;
  edad_base: number;
  edad_limite: number;
  cobertura_global: number;
  tiempo_limite: number;
  cupones: number;
  descuento: number;
  moneda: string;
  img: string;
  disponibilidad: string;
  status: number;
}
