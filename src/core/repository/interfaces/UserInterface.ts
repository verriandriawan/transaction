import BaseRepoInterface from './BaseRepoInterface'
import {UserEntityInterface} from '../../entity/UserEntity'

export default interface UserRepoInterface extends BaseRepoInterface {
    getAllUser(options: Record<string, any>): Promise<UserEntityInterface[] | []> 
    getUserBy(options: Record<string, any>): Promise<UserEntityInterface | null>
}