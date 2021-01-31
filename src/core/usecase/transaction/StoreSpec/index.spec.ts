import {expect} from 'chai';
import sinon, {stubInterface} from 'ts-sinon';
import "mocha";

import Setup, {StoreTransactionMock} from './setup';
import RequiredFieldTest from './require.fields';
import FlowValiate from './flow.validate';
import DebtCalculation from './debt.calulation';
import TransactionEntity from '../../../entity/TransactionEntity';


// TODO
// - check for failed create transction instance
describe("Transaction :: Store UseCase", () => {
    let useCaseParams: any

    before(() => useCaseParams = Setup())
    
    context("Required field must be provided", RequiredFieldTest())

    context("If product id not in database", () => {
        it("response should has error for invalid product", async () => {
            let transUc =  new StoreTransactionMock(useCaseParams)
            transUc.validateIdsProducts = () => Promise.resolve(false)

            let result = await transUc.execute({
                paid: 1,
                products: [{
                    item_id: 1,
                    price: 1,
                    weight: 1,
                    item_num: 1,
                }],
                type: 1,
                suplier_id: 1,
                user_id: 1,
                user_name: 'admin'
            })
            expect(result.errors.common).to.be.equal("errors.transaction.common.product_not_found")
        })
    })

    context("Get detail By Entity Type", () => {
        let request: any

        before(async () => {
            request = {
                paid: 1,
                products: [{
                    item_id: 1,
                    price: 1,
                    weight: 1,
                    item_num: 1,
                }],
                type: 1,
                user_id: 1,
                user_name: 'admin'
            }

            useCaseParams.itemRepo.getItemWhereIdIn.returns(['a'])
        })

        

        context("if type is 1", () => {
            it("Detail entity type is suplier", async () => {
                let transUc: any = new StoreTransactionMock(useCaseParams)
                let spy = sinon.spy(transUc, 'getDetailEntity')
                
                let payload = {...request, type: 1, suplier_id: 1} 
                await transUc.execute(payload)
                
                let result = spy.getCalls()
                let entity = await result[0].returnValue
                
                expect(entity.name).to.be.equal('suplier')
            })
        })

        context("if type is 2", () => {
            it("Detail entity type is customer", async () => {
                let transUc: any = new StoreTransactionMock(useCaseParams)
                transUc.validateIdsProducts = async () => true
                let spy = sinon.spy(transUc, 'getDetailEntity')

                let payload = {...request, type: 2, customer_id: 1}
                await transUc.execute(payload)

                let result = spy.getCalls()
                let entity = await result[0].returnValue
                
                expect(entity.name).to.be.equal('customer')
            })
        })
        
    })

    context("If cann't find entity from data source", () => {
        it ("response has errors common entity not found", async () => {
            let transUc = new StoreTransactionMock(useCaseParams)
            transUc.getDetailEntity = () => Promise.resolve(null)

            let result = await transUc.execute({
                paid: 1,
                products: [{
                    item_id: 1,
                    price: 1,
                    weight: 1,
                    item_num: 1,
                }],
                type: 1,
                suplier_id: 1,
                user_id: 1,
                user_name: 'admin'
            })
            expect(result.errors.common).to.be.equal("errors.transaction.suplier.not_found")
        })
    })

    
    context("Calculate total prices", () => {
        context("I have 1 product with weight 10 kg and price 100/kg", () => {
            it("total must be 1000", async () => {
                let transUc = new StoreTransactionMock(useCaseParams)
                let payload = TransactionEntity.init({
                    paid: 1,
                    products: [{
                        item_id: 1,
                        price: 100,
                        weight: 10,
                        item_num: 1,
                    }],
                    type: 1,
                    suplier_id: 1,
                    user_id: 1,
                    user_name: 'admin'
                }, 1)
                let result: any = transUc.priceCalculation(payload.products)
                expect(result).to.be.equal(1000)
            })
        })

        context("I have 2 product with weight 10 kg for each product and price 100/kg", () => {
            it ("total must be 2000", async () => {
                let transUc = new StoreTransactionMock(useCaseParams)
                let payload = TransactionEntity.init({
                    paid: 1,
                    products: [{
                        item_id: 1,
                        price: 100,
                        weight: 10,
                        item_num: 1,
                    },
                    {
                        item_id: 1,
                        price: 100,
                        weight: 10,
                        item_num: 1,
                    }],
                    type: 1,
                    suplier_id: 1,
                    user_id: 1,
                    user_name: 'admin'
                }, 1)
                
                let result: any = transUc.priceCalculation(payload.products)
                expect(result).to.be.equal(2000)
            })
        })
    })


    context("If have same item_id in products", () => {
        it ("merge all to 1 product", () => {
            let transUc = new StoreTransactionMock(useCaseParams)
            let payload = {
                paid: 1,
                products: [{
                    item_id: 1,
                    price: 100,
                    weight: 10,
                    item_num: 1,
                },
                {
                    item_id: 1,
                    price: 100,
                    weight: 10,
                    item_num: 1,
                }],
                type: 1,
                suplier_id: 1,
                user_id: 1,
                user_name: 'admin'
            }

            transUc.mergeSameProduct(payload)

            expect(payload.products.length).to.be.equal(1)
            expect(payload.products[0].price).to.be.equal(100)
            expect(payload.products[0].weight).to.be.equal(20)
        })

        it ("merge all to 2 product", () => {
            let transUc = new StoreTransactionMock(useCaseParams)
            let payload = {
                paid: 1,
                products: [{
                    item_id: 1,
                    price: 100,
                    weight: 10,
                    item_num: 1,
                },
                {
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

            transUc.mergeSameProduct(payload)
            expect(payload.products.length).to.be.equal(2)
            expect(payload.products[0].price).to.be.equal(100)
            expect(payload.products[1].price).to.be.equal(100)
            expect(payload.products[0].weight).to.be.equal(20)
            expect(payload.products[1].weight).to.be.equal(10)
        })
    })

    context("Validation total debt calculation", DebtCalculation())

    context("Validate for store data flow", FlowValiate())

})