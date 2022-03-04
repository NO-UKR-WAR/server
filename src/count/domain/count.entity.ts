import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Count {
  @PrimaryColumn()
  country_code: string;

  @Column({ type: 'bigint' })
  count: number;
}
