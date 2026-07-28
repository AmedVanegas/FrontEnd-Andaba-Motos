import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


const BASE_STYLE = {
  color: '#fff',
  background: '#1a1a1a',
};

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
      iconColor: '#d33',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#5e5e5e',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
      ...BASE_STYLE,
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
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#5e5e5e',
      cancelButtonText: 'Cancelar',
      confirmButtonText: isEditMode ? 'Guardar' : 'Crear',
      ...BASE_STYLE,
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
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#5e5e5e',
      cancelButtonText: 'Cancelar',
      confirmButtonText,
      ...BASE_STYLE,
    });
    return result.isConfirmed;
  }

  success(title: string, text?: string) {
    Swal.fire({
      title,
      text,
      icon: 'success',
      ...BASE_STYLE,
    });
  }

  error(title: string, text?: string) {
    Swal.fire({
      title,
      text,
      icon: 'error',
      iconColor:"#d33",
      confirmButtonColor:'#5e5e5e',
      ...BASE_STYLE,
    });
  }
}
