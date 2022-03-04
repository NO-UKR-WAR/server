import { EntityRepository, Repository } from 'typeorm';
import { Count } from '../count.entity';

@EntityRepository(Count)
export class CountRepository extends Repository<Count> {}
