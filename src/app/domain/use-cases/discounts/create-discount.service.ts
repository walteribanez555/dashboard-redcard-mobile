import { Injectable } from '@angular/core';
import { DiscountRepository } from '../../repositories/discount.repository';
import { CreateDiscountDto } from '../../dtos';
import { DiscountEntity } from '../../entities/discount.entity';
import { FileRepository } from '../../repositories/file.repository';

export interface CreateDiscountUseCase {
  execute(dto: CreateDiscountDto): Promise<DiscountEntity>;
}

@Injectable({
  providedIn: 'root',
})
export class CreateDiscountService implements CreateDiscountUseCase {
  constructor(private repository: DiscountRepository, private fileRepository : FileRepository) {}

  async execute(dto: CreateDiscountDto): Promise<DiscountEntity> {


    const filesUrl = await this.fileRepository.upload(dto.images);

    dto.images = filesUrl;

    return this.repository.createDiscount(dto);
  }
}
