import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() modalId: string = '';
  @Input() modalTitle: string = '';
  @Input() showSaveButton: boolean = false;

  @Output() saveClicked: EventEmitter<void> = new EventEmitter();

  save() {
    this.saveClicked.emit();
  }
}
