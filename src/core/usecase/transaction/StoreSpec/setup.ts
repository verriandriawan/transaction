import {stubInterface} from 'ts-sinon';

import ProfileEntity, {
    SuplierEntityInterface,
    CustomerEntityInterface
} from '../../../entity/ProfileEntity'

import {ConnectionInterface, DBTransaction} from '../../../repository/interfaces/BaseRepoInterface';

import TransactionRepoInterface from '../../../repository/interfaces/TransactionRepoInterface';
import SuplierRepoInterface from '../../../repository/interfaces/SuplierRepoInterface';
import CustomerRepoInterface from '../../../repository/interfaces/CustomerRepoInterface';
import RevenueRepoInterface from '../../../repository/interfaces/RevenueRepoInterface';
import DebtHitoryRepoInterface from '../../../repository/interfaces/DebtHistoryRepoInterface';
import JournalRepoInterface from '../../../repository/interfaces/JournalRepoInterface';
import ItemRepoInterface from '../../../repository/interfaces/ItemRepoInterface';
import StoreTransaction from '../StoreTransaction';

export class StoreTransactionMock extends StoreTransaction {
    constructor(params: any) {
        super(params)
        this.logger = {error: () => {}}
    }
}

export default () => {
    let data = {
        id: 1,
        name: 'name',
        phone: '1231',
        address: '1231',
    }
    
    let suplierEntity: SuplierEntityInterface = ProfileEntity.init(data)
    suplierEntity.name = 'suplier'
    
    let customerEntity: CustomerEntityInterface = ProfileEntity.init(data)
    customerEntity.name = 'customer'

    let transactionRepo: any = stubInterface<TransactionRepoInterface>()
    transactionRepo.storeTransaction.returns(Promise.resolve(null))
    transactionRepo.getInstance.callsFake(() => {
        return {transaction: () => {
            return {
                commit: async () => true,
                rollback: async () => true
            }
        }}
    })
    
    let suplierRepo = stubInterface<SuplierRepoInterface>()
    suplierRepo.getSuplierBy.returns(Promise.resolve(suplierEntity))

    let customerRepo: any = stubInterface<CustomerRepoInterface>()
    customerRepo.getCustomerBy.returns(Promise.resolve(customerEntity))

    let revenueRepo: any = stubInterface<RevenueRepoInterface>();
    revenueRepo.getRevenueBy.returns(null);

    let debtHistoryRepo: any = stubInterface<DebtHitoryRepoInterface>();
    debtHistoryRepo.getDebHitoryBy.returns({total_debt: 1000})

    let journalRepo: any = stubInterface<JournalRepoInterface>();
    journalRepo.storeJournal.returns({})

    let itemRepo: any = stubInterface<ItemRepoInterface>();
    itemRepo.getItem.returns([])

    return {
        journalRepo,
        revenueRepo,
        debtHistoryRepo,
        transactionRepo,
        suplierRepo,
        customerRepo,
        itemRepo
    }
    
}