import BaseRepoInterface from './BaseRepoInterface'
import { CustomerEntityInterface } from '../../entity/ProfileEntity'
import FilterInterface from './FilterInterface'

export default interface CustomerRepoInterface extends BaseRepoInterface {
    listCustomer(options: FilterInterface): Promise<CustomerEntityInterface[] | []>
    listCustomerByIds(ids: any[]): Promise<any[]>
    storeCustomer(entity: CustomerEntityInterface): Promise<CustomerEntityInterface | null>
    detailCustomerBy(options: Record<string, any>): Promise<CustomerEntityInterface | null>
    getCustomerBy(options: Record<string, any>): Promise<CustomerEntityInterface | null>
    updateCustomer(entity: CustomerEntityInterface): Promise<boolean>
}