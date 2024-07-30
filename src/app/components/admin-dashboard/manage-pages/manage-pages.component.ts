import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { PageModel } from '../../../services/models';
import { UtilService } from '../../../services/util.service';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { DirectiveModule } from '../../../directives/directive.module';
import { ActionSelectComponent } from "../../common/action-select/action-select.component";

@Component({
  selector: 'app-manage-pages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxEditorModule, DirectiveModule, ActionSelectComponent],
  providers: [ApiService],
  templateUrl: './manage-pages.component.html',
  styleUrl: './manage-pages.component.scss'
})
export class ManagePagesComponent implements OnInit, OnDestroy {
    pageForm!: FormGroup;
    isDataLoaded: boolean = false;
    pagesList: PageModel[] = [];

    editor!: Editor;
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];
    

    constructor(
        private readonly apiService: ApiService,
        private readonly utilService: UtilService
    ){}

    ngOnInit(): void {
        this.editor = new Editor();
        this.loadData();
        this.loadForm();
    }

    loadData(): void {
        this.apiService.getAllPages().subscribe(r => { 
            this.pagesList = r;
            this.isDataLoaded = true;
        });
    }

    loadForm(): void {
        this.pageForm = new FormGroup({
            id: new FormControl(),
            author: new FormControl(),
            title: new FormControl('', Validators.required),
            content: new FormControl('', Validators.required)
        });
    }

    onSave(): void {
        if(this.pageForm.valid) {
            this.isDataLoaded = false;
            this.apiService.addPage(this.pageForm.value).subscribe(r => {
                //this.loadData();
                // add subject here
                window.location.reload();
                this.pageForm.reset();
            });
        } else {
            this.pageForm.get('title')?.markAsTouched();
            this.pageForm.get('content')?.markAsTouched();
        }
        
    }

    onReset(): void {
        this.pageForm.reset();
    }

    editPage(index: number): void {
        this.pageForm.patchValue(this.pagesList[index]);
    }

    deletePage(index: number): void {
        this.apiService.deletePage(index).subscribe(() => {
            //this.loadData();
            // add subject here
            window.location.reload();
        });
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.pageForm, field);
    }

    onAction(action: string, index: number, id: number): void {
        if(action == 'edit') {
            this.editPage(index);
        } else if(action == 'delete') {
            this.deletePage(id);
        }
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }
}
