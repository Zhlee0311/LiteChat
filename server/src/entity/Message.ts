import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm'
import { User } from './User'


@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User)
    sender!: User

    @ManyToOne(() => User)
    receiver!: User

    @Column('text')
    content!: string

    @Column({ default: false })
    isRead!: boolean

    @CreateDateColumn()
    createAt!: Date
}