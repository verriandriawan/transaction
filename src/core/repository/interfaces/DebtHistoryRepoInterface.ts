import BaseRepoInterface from './BaseRepoInterface'
import {DebtHistoryEntityInterface} from '../../entity/DebtHistoryEntity'
import FilterInterface from './FilterInterface'

export default interface DebtHistoryRepoInterface extends BaseRepoInterface {
    listDebtHistory(options: FilterInterface): Promise<DebtHistoryEntityInterface[] | []>
    storeDebtHistory(entity: DebtHistoryEntityInterface): Promise<DebtHistoryEntityInterface | null>
    updateDebtHistory(entity: DebtHistoryEntityInterface): Promise<DebtHistoryEntityInterface | null>
    detailDebtHistoryBy(options: Record<string,any>): Promise<DebtHistoryEntityInterface | null>
    getDebtHistoryBy(options: Record<string, any>): Promise<DebtHistoryEntityInterface | null>
    getSumDebtHistoryBy(options: Record<string, any>): Promise<number>
}