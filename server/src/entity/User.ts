import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true })
    email!: string  // 唯一邮箱

    @Column({ unique: true })
    account!: string // 唯一定长账号

    @Column({ default: 'chat_user' })
    nickname!: string // 昵称，默认为 chat_user

    @Column({ nullable: true })
    avatar!: string // 头像链接

    @Column({ nullable: true })
    password!: string // 可空，邮箱登录不需要密码

    @CreateDateColumn()
    createAt!: Date // 创建时间
}