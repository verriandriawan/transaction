import BaseRepoInterface from './BaseRepoInterface'
import { ItemEntityInterface } from "../../entity/ItemEntity";
import FilterInterface from './FilterInterface';

export default interface ItemRepoInterface extends BaseRepoInterface {
    listItem(options: FilterInterface): Promise<ItemEntityInterface[] | []>
    storeItem(data: ItemEntityInterface): Promise<ItemEntityInterface | null>
    listItemByIds(ids: any[]): Promise<ItemEntityInterface[] | []>
    getItemWhereIdIn(ids: number[]): Promise<ItemEntityInterface[]>
}