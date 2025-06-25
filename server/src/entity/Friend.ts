import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column, } from 'typeorm'
import { User } from './User'

@Entity()
export class Friend {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User)
    userA!: User    //userA是发起好友请求的用户

    @ManyToOne(() => User)
    userB!: User // userB是接受好友请求的用户

    @Column()
    noteA2B!: string //用户A对用户B的备注，即发起好友请求的用户添加的备注

    @Column()
    noteB2A!: string //用户B对用户A的备注，即接受好友请求的用户添加的备注

    @CreateDateColumn()
    createAt!: Date
}