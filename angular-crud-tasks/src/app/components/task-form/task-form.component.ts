import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service'; 

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  @Input() task: Task = new Task();
  @Input() mode: 'create' | 'edit' = 'create'; 
  @Output() taskChange = new EventEmitter<Task>();

  constructor(private taskService: TaskService) {} 

  onSave() {
    if (this.mode === 'create') {
      this.taskService.createTask(this.task).subscribe(newTask => {
        this.taskChange.emit(newTask); 
      });
    } else if (this.mode === 'edit') {
      this.taskService.updateTask(this.task).subscribe(updatedTask => {
        this.taskChange.emit(updatedTask); 
      });
    }
  }
}
