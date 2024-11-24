import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @Column()
  filePath: string; // Store the file path or URL of the uploaded file

  @Column()
  userId: number; // Store the ID of the user who uploaded the document

  @ManyToOne(() => User, (user) => user.documents) // Optional: establish a relation with the User entity
  @JoinColumn({ name: "userId" }) // Link the userId to the User entity
  user: User; // Optional: Access the related user details (not mandatory for your current logic)
}
