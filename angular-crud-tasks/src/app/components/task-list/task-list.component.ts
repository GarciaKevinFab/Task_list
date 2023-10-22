import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';


declare var $: any;

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  selectedTask: Task = new Task();
  editMode: boolean = false;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};

  constructor(
    private taskService: TaskService, 
    private toastr: ToastrService,
    private dialog: MatDialog // <-- Añade esto
  ) { }
  
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers', // Tipo de paginación. 'full_numbers' muestra las páginas primero, anterior, siguiente y último.
      pageLength: 10, // Cantidad de registros por página.
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]], // Define las opciones para la cantidad de registros por página y su menú desplegable.
      search: {
        caseInsensitive: true, // La búsqueda no distinguirá entre mayúsculas y minúsculas.
        searchPlaceholder: "Buscar..." // Placeholder para el cuadro de búsqueda.
      },
      language: {
        lengthMenu: "Mostrar _MENU_ registros por página", // Personaliza el texto del menú de cantidad de registros.
        zeroRecords: "No se encontraron registros", // Mensaje cuando no hay registros que mostrar.
        info: "Mostrando página _PAGE_ de _PAGES_", // Información sobre las páginas mostradas.
        infoEmpty: "No hay registros disponibles", // Mensaje cuando no hay registros para mostrar.
        infoFiltered: "(filtrado de _MAX_ registros totales)", // Mensaje sobre el filtrado de registros.
        search: "Buscar:", // Texto al lado del cuadro de búsqueda.
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior"
        }, // Textos para la paginación.
      }
      // ... otras opciones de DataTables 
    };
    this.fetchTasks();
  }

  fetchTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.dtTrigger.next(true); 
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  openModal(modalId: string): void {
    $('#' + modalId).modal('show');
  }

  startCreatingTask() {
    this.selectedTask = new Task();
    this.editMode = false;
    this.openModal('addTaskModal');
  }

  startEditingTask(task: Task) {
    this.selectedTask = task;
    this.editMode = true;
    this.openModal('editTaskModal');
  }

  addTask() {
    this.taskService.createTask(this.selectedTask).subscribe(() => {
      this.fetchTasks();
      $('#addTaskModal').modal('hide');
      this.toastr.success('Tarea creada exitosamente!', 'Éxito');
      this.selectedTask = new Task();
    }, (error) => {
      console.error('Error creando la tarea:', error);
      this.toastr.error('Ocurrió un error al crear la tarea.', 'Error');
    });
  }


  editTask() {
    this.taskService.updateTask(this.selectedTask).subscribe(() => {
      this.fetchTasks();
      $('#editTaskModal').modal('hide');
      this.toastr.success('Tarea actualizada exitosamente!', 'Éxito');
      this.selectedTask = new Task();
    }, (error) => {
      console.error('Error actualizando la tarea:', error);
      this.toastr.error('Ocurrió un error al actualizar la tarea.', 'Error');
    });
  }


  deleteTask(_id?: string) {
    if (!_id) {
      console.error('Intento de eliminar una tarea sin un ID');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(_id).subscribe(
          () => {
            this.toastr.success('Tarea eliminada exitosamente', 'Éxito');
            this.fetchTasks();
          },
          (error) => {
            console.error('Error eliminando la tarea:', error);
            this.toastr.error('Ocurrió un error al eliminar la tarea', 'Error');
          }
        );
      }
    });
}

}
