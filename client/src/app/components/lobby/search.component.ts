import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchForm!: FormGroup;
  @Input() dialogVisible!: boolean;
  @Output() onDialogClose: Subject<string> = new Subject<string>();
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.createSearchForm();
  }
  createSearchForm() {
    this.searchForm = this.fb.group({
      query: this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }
  cancel() {
    this.createSearchForm();
    this.onDialogClose.next('');
  }
}
