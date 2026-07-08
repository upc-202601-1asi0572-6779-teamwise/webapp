import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { FieldInspection } from '../../../domain/model/inspection.entity';
import { InspectionService } from '../../../infrastructure/inspection-api.service';

@Component({
  selector: 'app-inspection-detail',
  imports: [DatePipe, RouterLink],
  templateUrl: './inspection-detail.component.html',
})
export class InspectionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly inspectionService = inject(InspectionService);

  readonly inspection = signal<FieldInspection | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');

  // ── i18n getters ──

  get backLabel(): string {
    return $localize`:@@insp.detail.back:Volver a inspecciones`;
  }

  get badgeLabel(): string {
    return $localize`:@@insp.detail.badge:Inspeccion de campo`;
  }

  get loadingText(): string {
    return $localize`:@@insp.detail.loading:Cargando inspeccion...`;
  }

  get observationsLabel(): string {
    return $localize`:@@insp.detail.observations:Observaciones`;
  }

  get findingsLabel(): string {
    return $localize`:@@insp.detail.findings:Hallazgos`;
  }

  get summaryLabel(): string {
    return $localize`:@@insp.detail.summary:Resumen`;
  }

  get interventionsLabel(): string {
    return $localize`:@@insp.detail.interventions:Intervenciones`;
  }

  get noInterventionsText(): string {
    return $localize`:@@insp.detail.noInterventions:No se registraron intervenciones asociadas a esta inspeccion.`;
  }

  get executedByLabel(): string {
    return $localize`:@@insp.detail.executedBy:Ejecutado por`;
  }

  get onLabel(): string {
    return $localize`:@@insp.detail.on:el`;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isNaN(id)) {
      this.load(id);
    } else {
      this.error.set('Inspeccion no valida.');
    }
  }

  private load(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.inspectionService
      .getById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (inspection) => this.inspection.set(inspection),
        error: () => this.error.set('No se pudo cargar la inspeccion.'),
      });
  }
}
