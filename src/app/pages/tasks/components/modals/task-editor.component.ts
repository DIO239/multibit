import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Task} from "../../types/task.interface";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {StatusPipe} from "../../pipes/status.pipe";
import {MatButtonModule} from "@angular/material/button";
import {LOCAL_STORAGE, StorageService} from "ngx-webstorage-service";

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrl: './task-editor.component.scss',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    StatusPipe
  ]
})

export class TaskEditorComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TaskEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null,
    @Inject(LOCAL_STORAGE) private storage: StorageService,
  ) {
  }

  private readonly tasksStorageKey = `tasks-multibit`
  private tasks: Task[] = [];

  statusOptions: string[] = ['pending', 'in_progress', 'completed'];

  taskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    status: new FormControl('pending', [Validators.required])
  })

  onSubmit() {
    if (this.taskForm.valid) {
      if (this.data) {
        const task = this.tasks.find(task => task.id === this.data!.id)
        if (task) {
          task.title = this.taskForm.value.title;
          task.description = this.taskForm.value.description;
          task.status = this.taskForm.value.status;
          this.tasks.splice(this.tasks.indexOf(task), 1, task);
          this.storage.set(this.tasksStorageKey, this.tasks)
          return this.dialogRef.close(this.tasks)
        }
      }
      const newTask: Task = {
        id: this.tasks[this.tasks.length - 1].id + 1,
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        status: this.taskForm.value.status
      }
      this.tasks.push(newTask)
      this.storage.set(this.tasksStorageKey, this.tasks)
      return this.dialogRef.close(this.tasks);
    }
  }

  onCancel() {
    this.dialogRef.close(null)
  }

  ngOnInit() {
    this.tasks = this.storage.get(this.tasksStorageKey)
    if (this.data) {
      this.taskForm.patchValue({
        title: this.data.title,
        description: this.data.description,
        status: this.data.status
      });
    }
  }
}
