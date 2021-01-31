export interface ProfileEntityInterface {
    id: any,
    name: string,
    phone: string,
    address: string,
    createdAt: any,
    updatedAt: any,
    deletedAt: any

    toJson(): Record<string, any>
}

export interface SuplierEntityInterface extends ProfileEntityInterface {}
export interface CustomerEntityInterface extends ProfileEntityInterface {}

class ProfileEntity implements ProfileEntityInterface {

    id: any
    name: string
    phone: string
    address: string
    createdAt: any
    updatedAt: any
    deletedAt: any

    constructor(data: Record<string,any>) {
        this.id = data.id
        this.name = data.name
        this.phone = data.phone
        this.address = data.address
        this.createdAt = data.created_at
        this.updatedAt = data.updated_at
        this.deletedAt = data.deleted_at
    }

    toJson(): Record<string, any> {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            address: this.address,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            deleted_at: this.deletedAt
        }
    }
}

export default {
    init: (data: Record<string, any>) => new ProfileEntity(data)
}