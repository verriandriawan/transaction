export interface TransactionDetailEntityInterface {
    transactionId: any
    price: number
    weight: number
    itemId: any
    itemNum: number,
    createdAt: any

    toJson(): Record<string,any>
}


class TransactionDetailEntity implements TransactionDetailEntityInterface{
    transactionId: any
    price: number
    weight: number
    itemId: any
    itemNum: number
    createdAt: any

    constructor(data: Record<string,any>) {
        this.transactionId = data.transaction_id,
        this.price = data.price,
        this.weight = data.weight,
        this.itemId = data.item_id,
        this.itemNum = data.item_num
        this.createdAt = data.created_at
    }

    toJson() {
        let data = {
            transaction_id: this.transactionId,
            price: this.price,
            weight: this.weight,
            item_id: this.itemId,
            item_num: this.itemNum,
            created_at: this.createdAt
        }
        return data
    }
}

export default {
    init: (data: Record<string, any>) => new TransactionDetailEntity(data) 
}