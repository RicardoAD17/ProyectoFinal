import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin-service.service';
import { CommonModule } from '@angular/common';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ApexChart, ApexXAxis, ApexAxisChartSeries } from 'ng-apexcharts';
export type ApexChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
};
@Component({
  selector: 'app-tablas',
   standalone: true,
   imports:[CommonModule,NgApexchartsModule],
  templateUrl: './tablas.component.html',
  styleUrl: './tablas.component.css',
})
export class TablasComponent {
  suscripciones: any[] = [];
  quejas: any[] = [];

  chartOptions: ApexChartOptions = {
    series: [{ name: 'Suscripciones', data: [] }],
    chart: { type: 'bar' as const, height: 350 },
    xaxis: { categories: [] }
  };


  constructor(private adminService: AdminService,private router: Router) {
    this.cargarDatos();
  }

  cargarDatos() {
    this.adminService.obtenerSuscripciones().subscribe({
      next: datos => {
        this.suscripciones = datos;
        this.generarGrafica();
      },
      error: err => console.error('Error cargando suscripciones', err)
    });

    this.adminService.obtenerQuejas().subscribe({
      next: datos => {
        this.quejas = datos;
      },
      error: err => console.error('Error cargando quejas', err)
    });
  }

  generarGrafica() {
    const conteoPorPlan: { [plan: string]: number } = {};

    this.suscripciones.forEach(sub => {
      const plan = sub.plan || 'Sin Plan';
      conteoPorPlan[plan] = (conteoPorPlan[plan] || 0) + 1;
    });
    this.chartOptions.xaxis.categories= Object.keys(conteoPorPlan);
    this.chartOptions.series[0].data = Object.values(conteoPorPlan);
  }


  eliminarSuscripcion(index: number) {
  const id = this.suscripciones[index].id;

  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la suscripción.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      this.adminService.eliminarSuscripcion(id).subscribe({
        next: () => {
          this.suscripciones.splice(index, 1);
          Swal.fire('Eliminado', 'La suscripción ha sido eliminada.', 'success');
        },
        error: err => console.error('Error al eliminar', err)
      });
    }
  });
}


  eliminarQueja(index: number) {
  const id = this.quejas[index].id;

  Swal.fire({
    title: '¿Eliminar queja?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      this.adminService.eliminarQueja(id).subscribe({
        next: () => {
          this.quejas.splice(index, 1);
          Swal.fire('Eliminada', 'La queja ha sido eliminada.', 'success');
        },
        error: err => console.error('Error al eliminar queja', err)
      });
    }
  });
}


  editarRegistro(tipo: 'suscripcion' | 'queja', index: number) {
    localStorage.setItem('registroEditando', JSON.stringify({ tipo, index }));
    this.router.navigate([tipo === 'suscripcion' ? '/suscripcion' : '/nosotros']);
  }
}
