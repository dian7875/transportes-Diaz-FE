import { Component, inject, Inject, OnInit } from '@angular/core';
import { ExpensesService } from '../Expenses/Expenses.service';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { HotToastService } from '@ngxpert/hot-toast';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { from } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-DeleteExpen',
  templateUrl: './DeleteExpen.component.html',
    imports: [CommonModule, ButtonModule],
})
export class DeleteExpenComponent {
  queryClient = inject(QueryClient);
  constructor(
    public dialogRef: DialogRef<boolean>,
    private expenseService: ExpensesService,
    @Inject(DIALOG_DATA) public id: number,
    private toast: HotToastService
  ) {}

  closeModal() {
    this.dialogRef.close();
  }
  confirmDelete() {
    from(this.expenseService.DeleteExpense(this.id))
      .pipe(
        this.toast.observe({
          loading: 'Eliminando gasto, por favor espere...',
          success: () => {
            this.queryClient.invalidateQueries({ queryKey: ['expenses'] });
            this.closeModal();
            return 'Gasto eliminado correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al eliminar el gasto: ${errorMessage}`;
          },
        })
      )
      .subscribe();
  }
}
