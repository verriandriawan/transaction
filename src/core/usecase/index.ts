import suplier from './suplier';
import auth from './auth';
import transaction from './transaction';

export const AuthenticateUseCase = auth.AuthenticateUseCase

export const ListSuplierUseCase = suplier.ListSuplier
export const StoreSuplierUseCase = suplier.StoreSuplier
export const DeleteSuplierUseCase = suplier.DeleteSuplier
export const DetailSuplierUseCase = suplier.DetailSuplier
export const UpdateSuplierUseCase = suplier.UpdateSuplier

export const StoreTransactionUseCase = transaction.StoreTransaction
export const ListTransactionUseCase = transaction.ListTransaction
