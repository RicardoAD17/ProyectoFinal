import { AfterViewInit, Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paypal-button',
  standalone: true,
  imports: [],
  templateUrl: './paypal-button.component.html',
  styleUrl: './paypal-button.component.css'
})
export class PaypalButtonComponent implements AfterViewInit{
 ngAfterViewInit(): void {
    // @ts-ignore
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '100.00' // Monto de la transacción
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          Swal.fire({
              icon: 'success',
              title: '¡Transacción completada!',
              text: 'Gracias por tu suscripción, Ricardo',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#3085d6'
            });

        });
      },
      onError: (err: any) => {
        console.error('Error en la transacción:', err);
      }
    }).render('#paypal-button-container');
  }
} 
