import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, } from 'typeorm'
import { User } from './User'

@Entity()
export class Friend {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User)
    userA!: User

    @ManyToOne(() => User)
    userB!: User

    @CreateDateColumn()
    createAt!: Date
}