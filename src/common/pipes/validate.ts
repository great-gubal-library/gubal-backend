import { ValidationPipe } from '@nestjs/common';

export const TransformAndValidate = new ValidationPipe({ transform: true, whitelist: true })

