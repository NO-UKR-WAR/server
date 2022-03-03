import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class ClickRequset {
  @IsNumber()
  @Min(0)
  @Max(800)
  @Type(() => Number)
  readonly click = 0;
  readonly authorization: string;
}
