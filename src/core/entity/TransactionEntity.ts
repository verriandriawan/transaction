import TransactionDetail, {TransactionDetailEntityInterface} from './TransactionDetailEntity'

export interface TransactionEntityInterface {
    id: any
    paid: number
    code: string
    entityId: any
    entityName: any
    userId: any
    userName: any
    type: number
    total: any
    status: number // 1: debt, 2: lunas
    createdAt: any
    updatedAt: any
    note: string
    revenueId: any
    products: TransactionDetailEntityInterface[]

    toJson(): Record<string, any>
}

class TransactionEntity implements TransactionEntityInterface {
    id: any
    paid: number
    code: string
    entityId: any
    entityName: any
    userId: any
    userName: any
    type: number
    total: any
    status: number // 1: debt, 2: lunas
    createdAt: any
    updatedAt: any
    note: string
    revenueId: any
    products: TransactionDetailEntityInterface[]
    
    constructor(data: Record<string, any>, type: number) {
        this.id = data.id
        this.paid = data.paid
        this.code = data.code
        this.entityId = data.entity_id
        this.entityName = data.entity_name
        this.userId = data.user_id
        this.userName = data.user_name
        this.type = type
        this.total = data.total
        this.note = data.note || ''
        this.revenueId = data.revenue_id
        this.status = data.status
        this.products = []

        if (!this.entityId) {
            switch(type) {
                case 1:
                    this.entityId = data.suplier_id
                    this.entityName = data.suplier_name
                    break;
                case 2:
                    this.entityId = data.customer_id
                    this.entityName = data.customer_name
                    break;
            }
        }

        if (data.products && data.products.length > 0) {
            this.products = data.products.map((item: any) => TransactionDetail.init(item))
        }
        
        this.createdAt = data.created_at
        this.updatedAt = data.updated_at
    }

    toJson() {
        let data: Record<string, any> = {
            id: this.id,
            paid: this.paid,
            code: this.code,
            user_id: this.userId,
            user_name: this.userName,
            total: this.total,
            note: this.note,
            status: this.status,
            created_at: this.createdAt,
            revenue_id: this.revenueId,
            updated_at: this.updatedAt
        }
        
        let entityType = 'suplier_id'
        let entityName = 'suplier_name'

        if (this.type > 1) {
            entityType = 'customer_id'
            entityName = 'customer_name'
        }
        
        data[entityType] = this.entityId,
        data[entityName] = this.entityName
        
        return data
    }
}

export default { 
    init: (data: Record<string,any>, type: number) => new TransactionEntity(data, type) 
}