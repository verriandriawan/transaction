import Response, { ResponseInterface } from '../Response';

import TransactionRepoInterface from '../../repository/interfaces/TransactionRepoInterface';
import SuplierRepoInterface from '../../repository/interfaces/SuplierRepoInterface';
import CustomerRepoInterface from '../../repository/interfaces/CustomerRepoInterface';
import RevenueRepoInterface from '../../repository/interfaces/RevenueRepoInterface';
import DebtHitoryRepoInterface from '../../repository/interfaces/DebtHistoryRepoInterface';
import JournaleRepoInterface from '../../repository/interfaces/JournalRepoInterface';

import { ProfileEntityInterface } from '../../entity/ProfileEntity';
import { TransactionDetailEntityInterface } from '../../entity/TransactionDetailEntity';
import TransactionEntity, { TransactionEntityInterface } from '../../entity/TransactionEntity';
import RevenueEntity, { RevenueEntityInterface } from '../../entity/RevenueEntity';
import JouralEntity, { JournalEntityInterface } from '../../entity/JournalEntity';
import DebtHistoryEntity, { DebtHistoryEntityInterface } from '../../entity/DebtHistoryEntity';
import ItemRepoInterface from '../../repository/interfaces/ItemRepoInterface';


export interface UseCaseInterface {
    transactionRepo: TransactionRepoInterface
    suplierRepo: SuplierRepoInterface
    customerRepo: CustomerRepoInterface
    revenueRepo: RevenueRepoInterface
    debtHistoryRepo: DebtHitoryRepoInterface
    journalRepo: JournaleRepoInterface
    itemRepo: ItemRepoInterface
}

/** UseCase Class to store transaction */
class StoreTransaction {
    private transactionRepo: TransactionRepoInterface
    private suplierRepo: SuplierRepoInterface
    private customerRepo: CustomerRepoInterface
    private revenueRepo: RevenueRepoInterface
    private debtHistoryRepo: DebtHitoryRepoInterface
    private journalRepo: JournaleRepoInterface
    private itemRepo: ItemRepoInterface

    private transactionEntity: TransactionEntityInterface;
    private revenueEntity: RevenueEntityInterface;
    private debtHistoryEntity: DebtHistoryEntityInterface

    private response: Response
    public trx: any
    public logger: any
    public entityType: number

    /**
     * Build UseCase
     * 
     * @param transactionRepo 
     * @param suplierRepo 
     * @param customerRepo 
     */
    constructor(private parameters: UseCaseInterface) {
        this.transactionRepo = parameters.transactionRepo
        this.suplierRepo = parameters.suplierRepo
        this.customerRepo = parameters.customerRepo
        this.revenueRepo = parameters.revenueRepo
        this.debtHistoryRepo = parameters.debtHistoryRepo
        this.journalRepo = parameters.journalRepo
        this.itemRepo = parameters.itemRepo

        this.transactionEntity = TransactionEntity.init({}, 0)
        this.revenueEntity = RevenueEntity.init({})
        this.debtHistoryEntity = DebtHistoryEntity.init({})

        this.response = new Response

        this.trx = null
        this.logger = {}
        this.entityType = 0
    }

    async execute(payload: Record<string, any>): Promise<ResponseInterface> {

        if (!this.validatePayload(payload)) {
            return this.response
        }

        this.entityType = payload.type
        this.mergeSameProduct(payload)

        let profileEntity = await this.getDetailEntity(payload);
        if (!profileEntity) {
            switch (this.entityType) {
                case 1:
                    this.response.errors.common = "errors.transaction.suplier.not_found"
                    break;

                case 2:
                    this.response.errors.common = "errors.transaction.customer.not_found"
                    break;

                default:
                    this.response.errors.common = "errors.transaction.common.entity_not_found"
            }
            return this.response
        }


        let productValid = await this.validateIdsProducts(payload)
        if (!productValid) {
            this.response.errors.common = "errors.transaction.common.product_not_found"
            return this.response
        }

        this.transactionEntity = TransactionEntity.init(payload, this.entityType)
        this.transactionEntity.entityId = profileEntity.id
        this.transactionEntity.entityName = profileEntity.name

        let trx = this.transactionRepo.getInstance();
        this.trx = await trx.transaction();

        if (!this.trx) {
            this.response.errors.common = "errors.transaction.can_not_create_transaction_instance"
            return this.response
        }

        this.switchTransaction();

        try {
            let result = await this.dispatchTransaction(payload);
            if (result) {
                this.response.data = this.transactionEntity.toJson()
                this.response.messages.common = "messages.transaction.succesfully_stored"
            }
            await this.trx.commit()
        } catch (e) {
            this.logger.error(e)
            this.response.errors.database = e.message
            this.trx.rollback()
        }

        this.trx = null
        this.switchTransaction()
        return this.response
    }

    switchTransaction() {
        let trx = this.trx ? this.trx : {}

        this.transactionRepo.trx = trx
        this.suplierRepo.trx = trx
        this.customerRepo.trx = trx
        this.revenueRepo.trx = trx
        this.debtHistoryRepo.trx = trx
        this.journalRepo.trx = trx
        this.itemRepo.trx = trx
    }

    /**
     * Validate required fields
     * 
     * @param payload Raw data request from outside infrastructur
     * @param response 
     * @returns Boolean
     */
    validatePayload(payload: Record<string, any>): Boolean {
        if (!payload.type) {
            throw new Error("errors.transaction.type.is_required")
        }

        if ([1, 2].indexOf(payload.type) === -1) {
            throw new Error("errors.transaction.type.is_invalid")
        }

        if (typeof payload.products === "undefined") {
            throw new Error("errors.transaction.products.is_required")
        }

        if (typeof payload.paid === "undefined") {
            throw new Error("errors.transaction.paid.is_required")
        }

        payload.products.forEach((product: any) => {
            ['weight', 'price', 'item_num', 'item_id'].forEach((key: string) => {
                if (!product[key]) {
                    this.response.errors[key] = `errors.transaction.${key}.is_missing`
                }
            })
        })
        if (Object.keys(this.response.errors).length > 0) return false

        if (!payload.user_id) {
            throw new Error("errors.transaction.user_id.is_required")
        }

        if (!payload.user_name) {
            this.response.errors.user_name = `errors.transaction.user_name.is_missing`
        }

        if (payload.type === 1) {
            if (!payload.suplier_id) {
                this.response.errors.suplier_id = "errors.transaction.suplier_id.is_required"
            }
        } else {
            if (!payload.customer_id) {
                this.response.errors.customer_id = "errors.transaction.customer_id.is_required"
            }
        }

        return Object.keys(this.response.errors).length === 0
    }

    /**
     * Validate Ids Product
     * @param payload Raw data request fro outside inftrastructure
     */
    async validateIdsProducts(payload: Record<string, any>): Promise<boolean> {
        let ids = payload.products.map((item: any) => item.item_id)
        let result = await this.itemRepo.getItemWhereIdIn(ids)

        return result && result.length > 0
    }


    /**
     * Merge products with same id
     * @param payload Raw data request from outsite infrastructure
     */
    async mergeSameProduct(payload: Record<string, any>) {
        let products: Record<string, any> = {}
        payload.products.forEach((item: any) => {
            if (!products[item.item_id]) {
                products[item.item_id] = item
            } else {
                let price = products[item.item_id].price
                products[item.item_id].price = item.price > price ? item.price : price
                products[item.item_id].weight += item.weight
            }
        })
        payload.products = Object.values(products)
    }


    /**
     * Get entity by type
     * @param payload Raw data request from outside infrastructure
     * @returns ProfileEntityInterface
     */
    async getDetailEntity(payload: Record<string, any>): Promise<ProfileEntityInterface | null> {
        if ([1, 2].indexOf(this.entityType) === -1) return null

        if (this.entityType === 1) {
            return this.suplierRepo.getSuplierBy({ id: payload.suplier_id })
        }
        return this.customerRepo.getCustomerBy({ id: payload.customer_id })
    }

    /**
     * Dispatcher Transaction
     * 
     * @param payload Raw data from outside infrastructure
     * @param profileEntity ProfileEntityInterface
     */
    async dispatchTransaction(payload: Record<string, any>) {
        let total = this.priceCalculation(this.transactionEntity.products)
        let paid = this.transactionEntity.paid
        this.transactionEntity.total = total

        this.transactionEntity.status = (paid - total) >= 0 ? 2 : 1
        this.generateUniqCode()

        let result = await this.revenueRepo.getRevenueBy({ status: false, deleted_at: null })
        if (!result) {
            if (this.entityType === 2) {
                throw new Error("errors.transaction.cash.not_found")
            }

            this.revenueEntity.totalPurchasing = this.transactionEntity.total
            if (total > paid) {
                this.revenueEntity.debtPurchasing = total - paid
            }

            this.revenueEntity = await this.insertIntoRevenue()
        } else {
            this.revenueEntity = result
        }

        this.transactionEntity.createdAt = this.revenueEntity.createdAt
        this.transactionEntity.updatedAt = this.revenueEntity.updatedAt
        this.transactionEntity.revenueId = this.revenueEntity.id

        this.transactionEntity = await this.insertIntoTransaction()

        await this.insertIntoDetailTransaction()
        await this.updateOrCreateDebtHistory()
        await this.storeIntoJournal()

        await this.recalculateRevenue(result)

        return true;
    }

    /**
     * Price calculation
     * @param payload Raw data from outside infrastructur
     */
    priceCalculation(products: TransactionDetailEntityInterface[]) {
        let total = 0
        products.forEach((product: any) => {
            total += product.price * product.weight
        })
        return total
    }

    /**
     * Generate uniq code for invoice
     */
    generateUniqCode() {
        let code = Math.random().toString(36).substring(7);
        this.transactionEntity.code = `${code}-${Math.floor(Date.now() / 1000)}`
    }

    /**
     * Save data into transaction table
     */
    async insertIntoTransaction(): Promise<TransactionEntityInterface> {
        this.transactionEntity.revenueId = this.revenueEntity.id
        this.transactionRepo.transactionType = this.transactionEntity.type
        let result = await this.transactionRepo.storeTransaction(this.transactionEntity)
        if (!result) throw new Error("errors.transaction.common.save_failed")

        this.transactionEntity.id = result.id
        return result
    }

    /**
     * Store datail data to transaction detail table
     */
    async insertIntoDetailTransaction(): Promise<boolean> {
        let result = await this.transactionRepo.storeDetailTransaction(this.transactionEntity)
        if (!result) throw new Error("errors.transaction.common.save_failed")
        return true
    }


    /**
     * Store revenue into database
     * @param revenue Revenue Entity
     */
    async insertIntoRevenue(): Promise<RevenueEntityInterface> {
        this.revenueEntity.totalAssets = this.revenueEntity.totalStock + this.revenueEntity.totalPurchasing
        this.revenueEntity.setTimestamp()
        let result = await this.revenueRepo.storeRevenue(this.revenueEntity)
        if (!result) throw new Error("errors.transaction.revenue.save_failed")

        this.revenueEntity = result
        return this.revenueEntity
    }


    /**
     * Update current revenue if revenue exists
     */
    async recalculateRevenue(entity: RevenueEntityInterface | null): Promise<RevenueEntityInterface | null> {
        if (!entity) return null
        if (this.entityType === 1) {
            this.revenueEntity.totalPurchasing += this.transactionEntity.total
            if (this.revenueEntity.debtPurchasing > 0) {
                this.revenueEntity.debtPurchasing -= this.transactionEntity.paid
            }
        } else {
            this.revenueEntity.totalSale += this.transactionEntity.total
            if (this.revenueEntity.totalPaid < this.revenueEntity.totalSale) {
                this.revenueEntity.totalPaid += this.transactionEntity.paid
            }
        }
        this.revenueEntity.recalculateEntity()

        let result = await this.revenueRepo.updateRevenue(this.revenueEntity)
        if (!result) throw new Error("errors.transaction.revenue.failed_update")
        return this.revenueEntity
    }



    /**
     * Store Debt History
     * 
     * @param payload Raw data request from outside infrastructure
     */
    async updateOrCreateDebtHistory(): Promise<boolean> {
        let result: any;
        try {
            let entityId = this.transactionEntity.entityId
            let entityType = this.transactionEntity.type
            let payload = {
                entity_id: entityId,
                entity_type: entityType
            }
            result = await this.debtHistoryRepo.getDebtHistoryBy(payload)
        } catch (e) { }

        let totalDebt = result ? result.totalDebt : 0
        totalDebt = this.calculateTotalDebt(totalDebt, this.transactionEntity)

        let payload: DebtHistoryEntityInterface = DebtHistoryEntity.init({
            id: result ? result.id : null,
            entity_id: this.transactionEntity.entityId,
            entity_name: this.transactionEntity.entityName,
            entity_type: this.transactionEntity.type,
            total_debt: totalDebt,
            created_at: this.transactionEntity.createdAt,
            updated_at: this.transactionEntity.updatedAt
        })

        this.debtHistoryEntity = payload
        if (!result) {
            result = await this.debtHistoryRepo.storeDebtHistory(payload)
        } else {
            payload.id = result.id
            result = await this.debtHistoryRepo.updateDebtHistory(payload)
        }

        if (!result) throw new Error("errors.transaction.common.save_failed")
        return true;
    }



    /**
     * Caculate total Debt
     * @param totalDebt current total debt
     */
    calculateTotalDebt(totalDebt: number, entity: TransactionEntityInterface): number {
        let paid = entity.paid
        let total = entity.total

        let rest = paid - total

        if (rest > 0) return totalDebt - rest
        return totalDebt + Math.abs(rest);
    }


    /**
     * Store Journal
     */
    async storeIntoJournal(): Promise<JournalEntityInterface> {
        let totalDebt = this.debtHistoryEntity.totalDebt
        totalDebt = totalDebt < 0 ? 0 : totalDebt

        let entity = JouralEntity.init({
            entity_id: this.transactionEntity.entityId,
            entity_name: this.transactionEntity.entityName,
            transaction_id: this.transactionEntity.id,
            transaction_date: this.transactionEntity.createdAt,
            type: this.transactionEntity.type,
            user_id: this.transactionEntity.userId,
            user_name: this.transactionEntity.userName,
            code: this.transactionEntity.code,
            paid: this.transactionEntity.paid,
            subtotal: this.transactionEntity.total,
            total_debt: totalDebt,
            paid_total: this.transactionEntity.paid,
            created_at: this.transactionEntity.createdAt,
            updated_at: this.transactionEntity.updatedAt
        })

        entity.setTimestamp()
        let result = await this.journalRepo.storeJournal(entity)
        if (!result) throw new Error("errors.transaction.journal.save_failed")

        return result
    }


}

export default StoreTransaction