import BaseRepoInterface from './BaseRepoInterface'
import { JournalEntityInterface } from "../../entity/JournalEntity";
import FilterInterface from './FilterInterface';

export default interface JournalRepoInterface extends BaseRepoInterface {
    listJournal(options: FilterInterface): Promise<JournalEntityInterface[] | []>
    detailJournalBy(options: Record<string, any>): Promise<JournalEntityInterface | null>
    storeJournal(journal: JournalEntityInterface): Promise<JournalEntityInterface | null>
    updateJournal(journal: JournalEntityInterface): Promise<JournalEntityInterface | null>
    storeBatchJournal(journals: JournalEntityInterface[]): Promise<boolean>
    updateStatusByIds(ids: any[], status: boolean): Promise<boolean>
}