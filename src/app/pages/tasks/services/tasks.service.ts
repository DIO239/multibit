import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Task} from "../types/task.interface";
import {LOCAL_STORAGE, StorageService} from "ngx-webstorage-service";

@Injectable()

export class TasksService {

  constructor(
    private http: HttpClient,
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) {}

  private readonly _jsonUrl = "assets/mock.json";
  private readonly tasksStorageKey = `tasks-multibit`;

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this._jsonUrl)
  }

  deleteTask(id: number) {
    const tasks: Task[] = this.storage.get(this.tasksStorageKey);
    tasks.splice(tasks.findIndex((task: Task) => task.id === id), 1)
    this.storage.set(this.tasksStorageKey, tasks)
    return tasks
  }
}
