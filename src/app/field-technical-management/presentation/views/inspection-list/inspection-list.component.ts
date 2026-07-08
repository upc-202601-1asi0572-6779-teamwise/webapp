import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../shared/infrastructure/auth.service';
import { FieldInspection } from '../../../domain/model/inspection.entity';
import { InspectionService } from '../../../infrastructure/inspection-api.service';

@Component({
  selector: 'app-inspection-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './inspection-list.component.html',
})
export class InspectionListComponent implements OnInit {
  private readonly inspectionService = inject(InspectionService);
  private readonly authService = inject(AuthService);

  readonly inspections = signal<FieldInspection[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly isAgronomist = computed(() => this.authService.currentUser?.role === 'agronomist');

  // ── i18n getters ──

  get badgeLabel(): string {
    return this.isAgronomist()
      ? $localize`:@@insp.list.badge.agronomist:Segmento agronomo`
      : $localize`:@@insp.list.badge.grower:Segmento productor`;
  }

  get headingText(): string {
    return $localize`:@@insp.list.heading:Inspecciones de campo`;
  }

  get subtitleText(): string {
    return $localize`:@@insp.list.subtitle:Historial de inspecciones tecnicas realizadas en las plantaciones a tu cargo.`;
  }

  get counterLabel(): string {
    return $localize`:@@insp.list.counter:inspecciones`;
  }

  get loadingText(): string {
    return $localize`:@@insp.list.loading:Cargando inspecciones...`;
  }

  get emptyTitle(): string {
    return $localize`:@@insp.list.empty:Sin inspecciones`;
  }

  get emptyDesc(): string {
    return $localize`:@@insp.list.emptyDesc:No hay inspecciones de campo registradas en el sistema.`;
  }

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set('');

    this.inspectionService
      .list({ size: 50 })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.inspections.set(response.inspections),
        error: () => this.error.set('No se pudieron cargar las inspecciones.'),
      });
  }
}
