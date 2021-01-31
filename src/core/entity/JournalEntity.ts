import moment from 'moment';
export interface JournalEntityInterface {
    id: any
    entityId: any
    entityName: string
    transactionId: any
    transactionDate: any
    type: number // 1: suplier, 2: customer
    code: string
    userId: any
    userName: string
    totalDebt: number
    paidTotal: number
    subTotal: number
    status: boolean
    paid: number
    journalType: number
    createdAt: any
    updatedAt: any
    deletedAt: any
    meta: any

    toJson(): Record<string,any>
    changeRecord(): void
    storeRecord(records: any): void
    setTimestamp(): void
    updateTimestamp(): void
}

class JournalEntity implements JournalEntityInterface {

    id: any
    entityId: any
    entityName: string
    transactionId: any
    transactionDate: any
    type: number // 1: suplier, 2: customer
    code: string
    userId: any
    userName: string
    totalDebt: number
    paidTotal: number
    subTotal: number
    status: boolean
    paid: number
    journalType: number // 0: transcation, 1: installment, 2: payback
    createdAt: any
    updatedAt: any
    deletedAt: any
    meta: any

    constructor(data: Record<string, any>) {
        this.id = data.id
        this.entityId = data.entity_id
        this.entityName = data.entity_name
        this.transactionId = data.transaction_id
        this.transactionDate = data.transaction_date
        this.type = data.type
        this.code = data.code
        this.userId = data.user_id
        this.userName = data.user_name
        this.totalDebt = data.total_debt || 0
        this.paidTotal = data.paid_total || 0
        this.subTotal = data.subtotal || 0
        this.status = data.status ? true : false
        this.paid = data.paid || 0
        this.journalType = data.journal_type
        this.createdAt = data.created_at
        this.updatedAt = data.updated_at
        this.deletedAt = data.deleted_at
        this.meta = data.meta || '{}'
    }

    toJson() {
        return {
            id: this.id,
            entity_id: this.entityId,
            entity_name: this.entityName,
            transaction_id: this.transactionId,
            transaction_date: this.transactionDate,
            type: this.type,
            code: this.code,
            user_id: this.userId,
            user_name: this.userName,
            subtotal: this.subTotal,
            status: this.status,
            total_debt: this.totalDebt,
            paid_total: this.paidTotal,
            paid: this.paid,
            journal_type: this.journalType,
            meta: this.meta,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            deleted_at: this.deletedAt
        }
    }

    changeRecord() {
        return JSON.parse(this.meta)
    }

    storeRecord(records: any) {
        this.meta = JSON.stringify(records)
    }

    setTimestamp() {
        let date = moment().format('YYYY-MM-DD HH:mm:ss')
        this.createdAt = date
        this.updatedAt = date
    }

    updateTimestamp() {
        this.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
    }

}

export default {
    init: (data: Record<string,any>) => new JournalEntity(data)
}