export interface DBTransaction {
  commit(): Promise<any>
  rollback(): Promise<any>
}

export interface ConnectionInterface {
  schema: any
  raw: any
  transaction(): Promise<DBTransaction>
}

export default interface BaseRepoInterface {
  table: string
  trx: DBTransaction

  getInstance(): ConnectionInterface
  getTable(): string;
  count(options: Record<string, any>): Promise<number>
}