export interface DebtHistoryEntityInterface {
  id: any
  entityId: any
  entityName: string
  entityType: number
  subTotal: number
  totalDebt: number
  createdAt: any
  updatedAt: any
  
  toJson(): Record<string, any>
}

class DebtHistoryEntity implements DebtHistoryEntityInterface {
  id: any
  entityId: any
  entityName: string
  entityType: number // 1: suplier, 2: customer
  subTotal: number
  totalDebt: number
  createdAt: any
  updatedAt: any

  constructor(data: Record<string,any>) {
    this.id = data.id
    this.entityId = data.entity_id
    this.entityName = data.entity_name
    this.entityType = data.entity_type
    this.subTotal = data.subtotal
    this.totalDebt = data.total_debt
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  toJson(): Record<string,any> {
    return {
      id: this.id,
      entity_id: this.entityId,
      entity_name: this.entityName,
      entity_type: this.entityType,
      total_debt: this.totalDebt,
      subtotal: this.subTotal
    }
  }
}

export default {
  init: (data: Record<string,any>) => new DebtHistoryEntity(data)
}