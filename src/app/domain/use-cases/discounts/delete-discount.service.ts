import { Injectable } from '@angular/core';
import { DiscountRepository } from '../../repositories/discount.repository';
import { FileRepository } from '../../repositories/file.repository';
import { DeleteDiscountDto } from '../../dtos/discounts/delete-discount.dto';

export interface DeleteDiscountUseCase {
  execute(dto : DeleteDiscountDto): Promise<any>;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteDiscountService implements DeleteDiscountUseCase {
  constructor(private repository: DiscountRepository, private fileRepository : FileRepository) {}
  async execute(dto  : DeleteDiscountDto): Promise<any> {
    const previousFiles = dto.files.map( file => file.split('/').pop()!);
    await Promise.all(
      previousFiles.map( file => this.fileRepository.delete(file))
    );

    return this.repository.deleteDiscount(dto.id);
  }
}
