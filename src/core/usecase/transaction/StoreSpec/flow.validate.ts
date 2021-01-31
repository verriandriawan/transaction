import { assert, expect } from 'chai';
import RevenueEntity from '../../../entity/RevenueEntity';
import StoreTransaction, { UseCaseInterface } from '../StoreTransaction';
import Setup, { StoreTransactionMock } from './setup';



export default () => {
    return () => {
        let useCaseParams: any;
        let storeUC: StoreTransaction
        let data: Record<string, any>
        let result: any

        let steps: any = [];
        let entities: Record<string, any> = {}

        before(async () => {
            useCaseParams = Setup()

            const fakeCallback = (key: string) => {
                return async (entity: any) => {
                    entity.id = 1;

                    entities[key] = entity
                    steps.push(key)

                    return entity
                }
            }

            // Inject storing method
            useCaseParams.transactionRepo.storeTransaction.callsFake(fakeCallback('transaction'))
            useCaseParams.transactionRepo.storeDetailTransaction.callsFake(fakeCallback('transaction_detail'))

            // store revenue will called if no revenue found in database
            // useCaseParams.revenueRepo.storeRevenue.callsFake(fakeCallback('revenue'))

            useCaseParams.revenueRepo.updateRevenue.callsFake(fakeCallback('update_revenue'))

            const fakeRevenue = RevenueEntity.init({ total_last_stock: 20 })
            useCaseParams.revenueRepo.getRevenueBy.returns(Promise.resolve(fakeRevenue))

            useCaseParams.debtHistoryRepo.storeDebtHistory.callsFake(fakeCallback('debt_history'))
            useCaseParams.journalRepo.storeJournal.callsFake(fakeCallback('journal'))

            storeUC = new StoreTransactionMock(useCaseParams)
            storeUC.trx = {
                commit: async () => true,
                rollback: async () => true
            }
            storeUC.switchTransaction()
            storeUC.validateIdsProducts = async () => true

            data = {
                paid: 3000,
                products: [{
                    item_id: 1,
                    price: 100,
                    weight: 10,
                    item_num: 1,
                },
                {
                    item_id: 2,
                    price: 100,
                    weight: 10,
                    item_num: 1,
                }],
                type: 1,
                suplier_id: 1,
                user_id: 1,
                user_name: 'admin'
            }
            result = await storeUC.execute(data)
        })

        context("If last stock is present", () => {
            context("Check for every entity", () => {

                it("transaction entity is valid", () => {
                    let entity = entities.transaction
                    expect(entity.code.length > 0).to.be.true
                    expect(entity.entityName).to.be.equal("suplier")
                    expect(entity.total).to.be.equal(2000)
                    expect(entity.status).to.be.equal(2)
                })

                it("transaction detail is valid", () => {
                    let entity = entities.transaction_detail.products[0]
                    expect(entity.price).to.be.equal(100)
                    expect(entity.weight).to.be.equal(10)
                    expect(entity.itemId).to.be.equal(1)
                    expect(entity.itemNum).to.be.equal(1)
                })


                it("Debt History is valid", () => {
                    let entity = entities.debt_history
                    expect(entity.totalDebt).to.be.equal(-1000)
                    expect(entity.entityId).to.be.equal(1)
                    expect(entity.entityName).to.be.equal("suplier")
                })

                it("Journal is valid", () => {
                    let entity = entities.journal

                    expect(entity.entityId).to.be.equal(1)
                    expect(entity.entityName).to.be.equal("suplier")
                    expect(entity.transactionId).to.be.equal(1)
                    expect(entity.type).to.be.equal(1)
                    expect(entity.code.length > 0).to.be.true
                    expect(entity.userId).to.be.equal(1)
                    expect(entity.userName).to.be.equal("admin")
                    expect(entity.paid).to.be.equal(3000)
                    expect(entity.subTotal).to.be.equal(2000)
                    expect(entity.totalDebt).to.be.equal(0)
                })
            })

            context("If all data is valid", () => {
                it("should have success message", async () => {
                    expect(result.messages.common).to.be.equal("messages.transaction.succesfully_stored")
                })
            })

            it("All storing step is dispatched properly", () => {
                expect(JSON.stringify(steps))
                    .to.be
                    .equal('["transaction","transaction_detail","debt_history","journal","update_revenue"]')
            })
        })


    }
}