import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Document } from "../../documents/entities/document.entity";

export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  VIEWER = "viewer",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role: UserRole;

  @OneToMany(() => Document, (document) => document.user) // Define the reverse relationship
  documents: Document[]; // A user can have many documents
}
