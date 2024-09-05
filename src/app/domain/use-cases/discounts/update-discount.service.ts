import { Injectable } from '@angular/core';
import { DiscountRepository } from '../../repositories/discount.repository';
import { UpdateDiscountDto } from '../../dtos';
import { FileRepository } from '../../repositories/file.repository';

export interface UpdateDiscountUseCase {
  execute(dto: UpdateDiscountDto): Promise<any>;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateDiscountService implements UpdateDiscountUseCase {
  constructor(private repository: DiscountRepository, private fileRepository : FileRepository) {}
  async execute(dto: UpdateDiscountDto): Promise<any> {
    const previousFiles = dto.previousFiles.map( file => file.split('/').pop()!);



    await Promise.all(
      previousFiles.map( file => this.fileRepository.delete(file))
    );

    console.log({dto});

    const filesUrl = await this.fileRepository.upload(dto.files);

    dto.files = filesUrl;

    console.log(dto);


    return this.repository.updateDiscount(dto);
  }
}
