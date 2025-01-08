import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: any) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Некоректний ід');
    }
    return value;
  }
}