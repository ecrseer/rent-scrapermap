import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RealEstate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  zipCode: string;

  @Column()
  rentVal: string;

  @Column()
  link: string;

  @Column()
  address: string;

  //   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  //   createdAt: Date;

  //   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  //   updatedAt: Date;
}
