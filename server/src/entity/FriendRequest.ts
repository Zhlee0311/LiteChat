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

    @Column()
    content!: string // 验证信息

    @Column()
    note!: string // 请求方对被请求方的备注

    @Column({
        type: 'enum',
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    })
    status!: FriendRequestStatus

    @CreateDateColumn()
    createAt!: Date
}