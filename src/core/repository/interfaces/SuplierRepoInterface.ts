import BaseRepoInterface from './BaseRepoInterface';
import {ProfileEntityInterface} from '../../entity/ProfileEntity';

export default interface SuplierRepoInterface extends BaseRepoInterface {

  listSuplier(options: Record<string, any>): Promise<ProfileEntityInterface[] | []>
  listSuplierByIds(ids: any[]): Promise<any[]>
  storeSuplier(payload: Record<string, any>): Promise<ProfileEntityInterface | null>
  detailSuplierBy(options: Record<string, any>): Promise<ProfileEntityInterface | null>
  getSuplierBy(options: Record<string, any>): Promise<ProfileEntityInterface | null>
  updateSuplier(entity: ProfileEntityInterface): Promise<boolean>
    
}