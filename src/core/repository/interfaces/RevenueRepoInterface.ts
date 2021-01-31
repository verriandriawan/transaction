import BaseRepoInterface from './BaseRepoInterface'

import { RevenueEntityInterface } from "../../entity/RevenueEntity";
import FilterInterface from './FilterInterface';

export default interface RevenueRepoInterface extends BaseRepoInterface {
    listRevenue(options: FilterInterface): Promise<RevenueEntityInterface[] | []>
    storeRevenue(entity: RevenueEntityInterface): Promise<RevenueEntityInterface | null>
    updateRevenue(enitty: RevenueEntityInterface): Promise<RevenueEntityInterface | null>
    getRevenueBy(options: Record<string, any>): Promise<RevenueEntityInterface | null>
    storeLastStockItems(payload: any[]): Promise<boolean>
    listStockRevenue(payload: Record<string, any>): Promise<any[]>
    clearItemStocks(id: any): Promise<boolean>
}