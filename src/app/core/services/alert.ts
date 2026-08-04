import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {
  /**
   * Modal de confirmación para eliminar un registro.
   * @param entityLabel ej: 'el usuario', 'la motocicleta', 'el producto'
   * @param itemName ej: username, placa, nombre del producto
   * @returns true si el usuario confirmó, false si canceló
   */
  async confirmDelete(entityLabel: string, itemName: string): Promise<boolean> {
    const result = await Swal.fire({
      title: `¿Seguro que quiere eliminar ${entityLabel} ${itemName}?`,
      text: 'No se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
      buttonsStyling: false,
      customClass: {
        popup: 'glass-swal',
        confirmButton: 'glass-btn glass-btn--danger',
        cancelButton: 'glass-btn glass-btn--ghost',
      },
    });
    return result.isConfirmed;
  }

  /**
   * Modal de confirmación para guardar cambios de un formulario
   * (usado sobre todo en modo edición, antes de llamar al servicio).
   * @param entityLabel ej: 'el usuario', 'la motocicleta', 'el producto'
   * @param isEditMode true = editar, false = crear
   */
  async confirmSave(entityLabel: string, isEditMode: boolean): Promise<boolean> {
    const result = await Swal.fire({
      title: isEditMode
        ? `¿Guardar los cambios de ${entityLabel}?`
        : `¿Crear ${entityLabel}?`,
      text: isEditMode ? 'Se actualizará la información existente.' : undefined,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: isEditMode ? 'Guardar' : 'Crear',
      buttonsStyling: false,
      customClass: {
        popup: 'glass-swal',
        confirmButton: 'glass-btn glass-btn--success',
        cancelButton: 'glass-btn glass-btn--ghost',
      },
    });
    return result.isConfirmed;
  }

  /** Modal genérico de confirmación (para acciones que no son ni crear/editar/eliminar) */
  async confirm(title: string, text?: string, confirmButtonText = 'Confirmar'): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText,
      buttonsStyling: false,
      customClass: {
        popup: 'glass-swal',
        confirmButton: 'glass-btn glass-btn--success',
        cancelButton: 'glass-btn glass-btn--ghost',
      },
    });
    return result.isConfirmed;
  }

  success(title: string, text?: string) {
    Swal.fire({
      title,
      text,
      icon: 'success',
      buttonsStyling: false,
      customClass: {
        popup: 'glass-swal',
        confirmButton: 'glass-btn glass-btn--success',
      },
    });
  }

  error(title: string, text?: string) {
    Swal.fire({
      title,
      text,
      icon: 'error',
      buttonsStyling: false,
      customClass: {
        popup: 'glass-swal',
        confirmButton: 'glass-btn glass-btn--danger',
      },
    });
  }
}