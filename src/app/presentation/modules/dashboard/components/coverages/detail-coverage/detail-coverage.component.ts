import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { MultipleFileInputComponent } from '../../../../shared/components/custom-inputs/multiple-file-input/multiple-file-input.component';
import { DetailListener } from '../../../interfaces/Detail.listener';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CoverageEntity } from '../../../../../../domain/entities/coverage.entity';
import { fetchImageAsFile } from '../../../../shared/utils/images';

// public readonly coverage_id: number | null,
// public readonly id : number | null,
// public readonly title: string,
// public readonly description: string,
// public readonly files: string[],

@Component({
  selector: 'app-detail-coverage',
  standalone: true,
  imports: [
    CommonModule,
    MultipleFileInputComponent,
    FormsModule,
    ReactiveFormsModule,
    MultipleFileInputComponent,
  ],
  templateUrl: './detail-coverage.component.html',
})
export class DetailCoverageComponent implements AfterViewInit {
  async ngAfterViewInit(): Promise<void> {
    const files = this.coverage.files;
    console.log({ files });

    const filesConverted = await Promise.all(
      files.map((file) => fetchImageAsFile(file, file.split('/').pop() || ''))
    );

    this.coverageForm = new FormGroup({
      id: new FormControl(this.coverage.id),
      title: new FormControl(this.coverage.title),
      description: new FormControl(this.coverage.description),
      previousFiles : new FormControl(files),
      files: new FormControl(filesConverted),
    });
  }


  ngOnInit(): void {}

  @Input() detailListener!: DetailListener<CoverageEntity>;
  @Input() coverage!: CoverageEntity;

  coverageForm = new FormGroup({
    id: new FormControl(),
    title: new FormControl(),
    description: new FormControl(),
    previousFiles : new FormControl(),
    files: new FormControl(),
  });

  close() {
    this.detailListener.close();
  }

  onSubmit() {
    this.detailListener.submit(this.coverageForm);
  }

  onDelete( ) {
    this.detailListener.delete(this.coverage);
  }
}
