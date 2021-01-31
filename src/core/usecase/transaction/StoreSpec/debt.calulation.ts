import {expect} from 'chai'
import Setup, {StoreTransactionMock} from './setup'
import TransactionEntity from '../../../entity/TransactionEntity'

export default () => {
  return () => {
      let useCase: any
      let entity: any
      let useCaseParams: any
      
      before(() => {
          let useCaseParams = Setup()
          useCase = new StoreTransactionMock(useCaseParams)
          entity = TransactionEntity.init({}, 1)
      })

      context("if I dont have debt to suplier, and I pay 2000 for total 10000", () => {
          it("I own to suplier must be 8000", () => {
              entity.paid = 2000
              entity.total = 10000

              let iDebt = 0
              let result = useCase.calculateTotalDebt(iDebt, entity)

              expect(result).to.be.equal(8000)
          })
      })

      context("If dont have any debt to suplier, and I pay 12000 for total 10000", () => {
          it("Suplier should return 2000 for me", () => {
              entity.paid = 12000
              entity.total = 10000

              let iDebt = 0

              let result = useCase.calculateTotalDebt(iDebt, entity)
              expect(result).to.be.equal(-2000)
          })
      })

      context("If I have a debt to suplier about 2000, and I pay 1000 for current total transaction 10000", () => {
          it("I own to suplier must be 11000", () => {
              entity.paid = 1000
              entity.total = 10000
              
              let iDebt = 2000
              let result = useCase.calculateTotalDebt(iDebt, entity)
              expect(result).to.be.equal(11000)
          })
      })

      context("If I have a debt to supier about 2000, and I pay 13000 for current total transaction 10000", () => {
          it("Suplier should return 1000", () => {
              entity.paid = 13000
              entity.total = 10000

              let iDebt = 2000
              let result = useCase.calculateTotalDebt(iDebt, entity)
              expect(result).to.be.equal(-1000)
          })
      })
  }
}
