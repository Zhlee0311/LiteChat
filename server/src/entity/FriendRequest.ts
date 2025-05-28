import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { User } from './User'

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected'

@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User)
    fromUser!: User

    @ManyToOne(() => User)
    toUser!: User

    @Column({
        type: 'enum',
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    })
    status!: FriendRequestStatus

    @CreateDateColumn()
    createAt!: Date
}