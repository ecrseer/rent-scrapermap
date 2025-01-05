import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Addresses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  zipCode: string;

  @Column()
  address: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;
}
