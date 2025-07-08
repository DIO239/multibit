import {Component, DestroyRef, Inject, OnInit} from "@angular/core";
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TasksService} from "./services/tasks.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Task} from "./types/task.interface";
import {MatCardModule} from "@angular/material/card";
import {StatusPipe} from "./pipes/status.pipe";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {Filter} from "./types/filter.interface";
import {MatDialog} from "@angular/material/dialog";
import {TaskEditorComponent} from "./components/modals/task-editor.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    StatusPipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  providers: [TasksService],
  standalone: true
})

export class TasksComponent implements OnInit {

  constructor(
    private tasksService: TasksService,
    private router: Router,
    private destroyRef: DestroyRef,
    public dialog: MatDialog,
    @Inject(LOCAL_STORAGE) private storage: StorageService,
  ) {
  }

  public tasks: Task[] = [];
  private readonly tasksStorageKey = `tasks-multibit`
  public selectedStatus: string | null = null;
  public searchQuery: string = '';
  public statusOptions: string[] = ['pending', 'in_progress', 'completed'];
  private filter: Filter = {
    status: null,
    search: ''
  }

  tasksFilter() {
    this.filter.search = this.searchQuery
    this.filter.status = this.selectedStatus
    if (this.filter.search || this.filter.status) {
      this.tasks = this.storage.get(this.tasksStorageKey).filter((task: Task) => {return task.status === this.filter.status || task.title === this.filter.search});
    }
  }

  clearFilter() {
    this.selectedStatus = null
    this.searchQuery = ''
    this.filter.status = this.selectedStatus
    this.filter.search = this.searchQuery
    this.getTasks()
  }

  openDialog(task?: Task) {
    const data = task ? task : null;
    const dialogRef = this.dialog.open(TaskEditorComponent, {
      width: '400px',
      data: data
    })
    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (result) => {
        if (result) {
          this.tasks = result
        }
      }
    })
  }

  goTask(id: number) {
    this.router.navigate(['/task', id]);
  }

  deleteTask(id: number) {
    this.tasks = this.tasksService.deleteTask(id)
  }

  getTasks() {
    if (this.storage.has(this.tasksStorageKey) && this.storage.get(this.tasksStorageKey).length > 0) {
      return this.tasks = this.storage.get(this.tasksStorageKey)
    }
    return this.tasksService.getTasks().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        this.storage.set(this.tasksStorageKey, response)
        this.tasks = response
      },
      error: (e) => {
        console.error(e)
      }
    })
  }

  ngOnInit() {
    this.getTasks()
  }
}
