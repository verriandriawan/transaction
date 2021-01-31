export interface RangeInterface {
  from: any
  to: any
}

export default interface FilterInterface {
  conditional: Record<string, any>;
  order: Record<string, string>;
  conditionalWhere?: Record<string,any>
  q?: string;
  limit?: number;
  offset?: number;
  params?: Record<string, any>;
  range?: Record<string, RangeInterface>;
  raws?: Record<string, any>;
}