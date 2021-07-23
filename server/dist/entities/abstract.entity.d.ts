import { BaseEntity } from 'typeorm';
export declare abstract class AbstractEntity extends BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    generateId(): Promise<void>;
}
