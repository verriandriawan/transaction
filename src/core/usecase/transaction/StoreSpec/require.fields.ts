import { expect } from 'chai';

import { UseCaseInterface } from '../StoreTransaction';
import Setup, { StoreTransactionMock } from './setup'

export default () => {
    return () => {
        let result: any;
        let payload: any;
        let useCaseParams: UseCaseInterface

        before(async () => {
            useCaseParams = Setup()
            payload = {
                user_id: 1,
                user_name: 'admin',
                type: 1,
                paid: 100,
                products: [
                    { item_id: 1, weight: 100, price: 100, item_num: 100 }
                ]
            }
        })

        context(`if type not in payload`, () => {
            it('response has error for type', async () => {
                let transUc = new StoreTransactionMock(useCaseParams)
                let message = null
                try {
                    await transUc.execute({ ...payload, type: null })
                } catch (e) {
                    message = e.message
                }
                expect(message).to.be.equal(`errors.transaction.type.is_required`)
            })
        })

        context('if entity type is not between 1,2', () => {
            it("response has errors for type", async () => {
                let transUc = new StoreTransactionMock(useCaseParams)
                let message = null
                try {
                    await transUc.execute({ ...payload, type: 3 })
                } catch (e) {
                    message = e.message
                }
                expect(message).to.be.equal(`errors.transaction.type.is_invalid`)
            })
        })

        context(`if entity type is 1, and suplier_id not in payload`, () => {
            it('response has error for suplier_id', async () => {
                let transUc = new StoreTransactionMock(useCaseParams)
                result = await transUc.execute(payload)
                expect(result.errors.suplier_id).to.be.equal(`errors.transaction.suplier_id.is_required`)
            })
        })

        context(`if entity type is 2, and customer_id not in payload`, () => {
            it("response has error for customer_id", async () => {
                let transUc = new StoreTransactionMock(useCaseParams)
                result = await transUc.execute({ ...payload, type: 2 })
                expect(result.errors.customer_id).to.be.equal("errors.transaction.customer_id.is_required")
            })
        })

        context('if paid not in payload', () => {
            it("response has error for paid", async () => {
                let transUc = new StoreTransactionMock(useCaseParams)
                let params = { ...payload }
                delete params.paid

                let message = null
                try {
                    await transUc.execute(params)
                } catch (e) {
                    message = e.message
                }
                expect(message).to.be.equal("errors.transaction.paid.is_required")
            })
        })

        context('if user_name not in payload', () => {
            it("response has error for user_name", async () => {
                let transUc = new StoreTransactionMock(useCaseParams)
                let params = { ...payload }
                delete params.user_name

                result = await transUc.execute(params)
                expect(result.errors.user_name).to.be.equal("errors.transaction.user_name.is_missing")
            })
        })

        context("if products is not in payload", () => {
            it("response has error for transaction", async () => {
                let transUc = new StoreTransactionMock(useCaseParams)
                let params = { ...payload }
                delete params.products

                let message = null
                try {
                    await transUc.execute(params)
                } catch (e) {
                    message = e.message
                }

                expect(message).to.be.equal("errors.transaction.products.is_required")
            })
        })

        context("validate products field", () => {
            let product: any
            before(() => {
                product = {
                    item_id: 1,
                    weight: 1,
                    price: 1,
                    item_num: 1
                }
            })

            context("some of key is missing from product", () => {
                ['weight', 'price', 'item_num', 'item_id'].forEach((key: string) => {
                    it(`if ${key} not in product, repsonse has error ${key}`, async () => {
                        let transUc = new StoreTransactionMock(useCaseParams)

                        let item = { ...product }
                        delete item[key]
                        let params = { ...payload, products: [item] }
                        result = await transUc.execute(params)

                        expect(result.errors[key]).to.be.equal(`errors.transaction.${key}.is_missing`)
                    })
                })
            })
        })

    }
}