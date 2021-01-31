import BaseRepoInterface from './BaseRepoInterface'
import {TransactionEntityInterface} from '../../entity/TransactionEntity';
import { TransactionDetailEntityInterface } from '../../entity/TransactionDetailEntity';
import FilterInterface from './FilterInterface';

export default interface TransactionRepoInterface extends BaseRepoInterface {
    transactionType: number
    
    listTransaction(options: Record<string, any>): Promise<TransactionEntityInterface[] | []>
    listTransactionByIds(ids: any[]): Promise<[]>
    updateStatusByIds(ids: any[], status: number): Promise<boolean>
    detailTranscationBy(options: Record<string, any>): Promise<TransactionEntityInterface | null>
    storeTransaction(entity: TransactionEntityInterface): Promise<TransactionEntityInterface | null>
    updateTransaction(entity: TransactionEntityInterface): Promise<TransactionEntityInterface | null>
    listTransactionDetail(options: FilterInterface): Promise<TransactionDetailEntityInterface[] | []>
    storeDetailTransaction(entity: TransactionEntityInterface): Promise<boolean>
    listDetailTranscation(options: FilterInterface): Promise<any[]>
}