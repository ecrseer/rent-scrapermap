// import { RealEstate } from 'src/real-estates/entities/real-estate.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum StepStatus {
  STARTED,
  SAVED_PAGE_LINKS,
  SCRAPPING_REAL_ESTATES,
  FINISHED,
}

@Entity()
export class EstatesPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sourceUrl: string;

  @Column()
  page: number;

  @Column({ type: 'json' })
  links: string[];

  @Column()
  stepStatus: StepStatus;

  @Column({ nullable: true })
  stepScrappingRealEstatesLinkIndex: number;
}
