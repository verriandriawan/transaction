import moment from 'moment'
export interface RevenueEntityInterface {
    id: any
    totalSale: number
    totalPaid: number
    totalPurchasing: number
    debtPurchasing: number
    totalStock: number
    totalLastStock: number
    totalAssets: number
    totalOperational: number
    totalNetMargin: number
    totalRevenue: number
    status: boolean
    createdAt: any
    updatedAt: any
    deletedAt: any

    toJson(): Record<string,any>
    recalculateEntity(): void
    setTimestamp(date?: any): void
    updateTimestamp(): void
}

class RevenueEntity {
    id: any
    totalSale: number
    totalPaid: number
    totalPurchasing: number
    debtPurchasing: number
    totalStock: number
    totalLastStock: number
    totalAssets: number
    totalOperational: number
    totalNetMargin: number
    totalRevenue: number
    status: boolean
    createdAt: any
    updatedAt: any
    deletedAt: any
    
    constructor(data: Record<string,any>) {
        this.id =  data.id
        this.totalSale = data.total_sale || 0
        this.totalPaid = data.total_paid || 0
        this.totalPurchasing =  data.total_purchasing || 0
        this.debtPurchasing = data.debt_purchasing || 0
        this.totalStock =  data.total_stock || 0
        this.totalLastStock =  data.total_last_stock || 0
        this.totalAssets =  data.total_assets || 0
        this.totalOperational =  data.total_operational || 0
        this.totalNetMargin =  data.total_net_margin || 0
        this.totalRevenue =  data.total_revenue || 0
        this.status =  data.status,  
        this.createdAt = data.created_at,
        this.updatedAt = data.updated_at,
        this.deletedAt = data.deleted_at
    }

    toJson() {
        return {
            id: this.id,
            total_sale: this.totalSale,
            total_paid: this.totalPaid,
            total_purchasing: this.totalPurchasing,
            debt_purchasing: this.debtPurchasing,
            total_stock: this.totalStock,
            total_last_stock: this.totalLastStock,
            total_assets: this.totalAssets,
            total_operational: this.totalOperational,
            total_net_margin: this.totalNetMargin,
            total_revenue: this.totalRevenue,
            status: this.status,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            deleted_at: this.deletedAt
        }
    }

    recalculateEntity() {
        this.totalAssets = this.totalPurchasing + this.totalStock
        let sale = this.totalSale
        let purchasing = this.totalPurchasing
        let lastStock = this.totalLastStock
        let totalOperational = this.totalOperational
        
        let stock = purchasing - lastStock + this.totalStock
        this.totalRevenue = sale - (stock + totalOperational)
        
        let margin: any = 0.0
        let total = this.totalAssets - this.totalLastStock
        if (total > 0) {
            margin = ((this.totalRevenue / total) * 100).toFixed(2)
        }
        this.totalNetMargin = parseFloat(margin)
    }

    setTimestamp(date?: any) {
        date = date || moment().format('YYYY-MM-DD HH:mm:ss')
        this.createdAt = date
        this.updatedAt = date
    }

    updateTimestamp() {
        this.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
    }
}

export default {
    init: (data: Record<string,any>) => new RevenueEntity(data) 
}