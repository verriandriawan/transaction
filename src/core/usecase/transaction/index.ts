import {
  TransRepo,
  RevenueRepo,
  ItemRepo,
  JournalRepo,
  CustomerRepo,
  DebtHistoryRepo,
  SuplierRepo
} from '../../repository'

import StoreTransaction from './StoreTransaction'
import ListTransaction from './ListTransaction'
import DetailTransaction from './DetailTransaction'
import UpdateNoteTransaction from './UpdateNoteTransaction'

const storeTransaction = { init: () => {
  return new StoreTransaction({
    transactionRepo: new TransRepo, 
    suplierRepo: new SuplierRepo,
    customerRepo: new CustomerRepo,
    revenueRepo: new RevenueRepo,
    debtHistoryRepo: new DebtHistoryRepo,
    journalRepo: new JournalRepo,
    itemRepo: new ItemRepo
  }) 
}}

const listTransaction = { init: () => {
  return new ListTransaction({
    transactionRepo: new TransRepo, 
    customerRepo: new CustomerRepo, 
    suplierRepo: new SuplierRepo
  }) }
}

const detailTransaction = { init: () => {
  return new DetailTransaction({
    transactionRepo: new TransRepo, 
    customerRepo: new CustomerRepo, 
    suplierRepo: new SuplierRepo, 
    itemRepo: new ItemRepo,
    journalRepo: new JournalRepo
  })}
}

const updateNoteTransaction = { init:() => {
  return new UpdateNoteTransaction({
    transactionRepo: new TransRepo
  })
}}

export default {
  StoreTransaction: storeTransaction,
  ListTransaction: listTransaction,
  DetailTransaction: detailTransaction,
  UpdateNoteTransaction: updateNoteTransaction
}