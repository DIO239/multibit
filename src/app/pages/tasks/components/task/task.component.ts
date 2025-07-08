import {Component, DestroyRef, Inject, OnInit} from "@angular/core";
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {StatusPipe} from "../../pipes/status.pipe";
import {ActivatedRoute, Router} from "@angular/router";
import {LOCAL_STORAGE, StorageService} from "ngx-webstorage-service";
import {Task} from "../../types/task.interface";
import {TaskEditorComponent} from "../modals/task-editor.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatDialog} from "@angular/material/dialog";
import {TasksService} from "../../services/tasks.service";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatMiniFabButton,
    MatOption,
    MatSelect,
    MatSuffix,
    ReactiveFormsModule,
    StatusPipe
  ],
  providers: [TasksService],
  standalone: true
})

export class TaskComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    public dialog: MatDialog,
    private tasksService: TasksService,
    @Inject(LOCAL_STORAGE) private storage: StorageService,
  ) {}

  private readonly tasksStorageKey = `tasks-multibit`

  public task: Task | undefined = undefined;

  back() {
    this.router.navigate(['/tasks']);
  }

  openDialog(task: Task) {
    const data = task
    const dialogRef = this.dialog.open(TaskEditorComponent, {
      width: '400px',
      data: data
    })
    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (result) => {
        if (result) {
          this.task = result.find((task: Task) => task.id === data.id);
        }
      }
    })
  }

  deleteTask(id: number) {
    this.tasksService.deleteTask(id)
    this.router.navigate(['/tasks']);
  }

  ngOnInit() {
    this.route.params.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((params) => {
      this.task = this.storage.get(this.tasksStorageKey).find((task: Task) => task.id === +params['id'])
      if (!this.task) {
        this.router.navigate(['/not-found']);
      }
    })
  }

}
