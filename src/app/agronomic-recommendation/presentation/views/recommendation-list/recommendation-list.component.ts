import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgronomicRecommendationStore } from '../../../application/agronomic-recommendation.store';

@Component({
  selector: 'app-recommendation-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './recommendation-list.component.html',
})
export class RecommendationListComponent implements OnInit {
  readonly store = inject(AgronomicRecommendationStore);

  readonly activeTab = signal<'pending' | 'published'>('published');

  readonly filteredRecommendations = computed(() => {
    const recs = this.store.recommendations();
    if (this.activeTab() === 'pending') {
      return recs.filter((r) => r.status !== 'published');
    }
    return recs.filter((r) => r.status === 'published');
  });

  readonly priorityColors: Record<string, string> = {
    critical: 'var(--color-danger)',
    high: 'var(--color-warning)',
    medium: 'var(--color-accent-cyan)',
    low: 'var(--color-success)',
  };

  readonly statusColors: Record<string, string> = {
    draft: 'var(--color-text-muted)',
    pending_review: 'var(--color-warning)',
    approved: 'var(--color-accent-cyan)',
    published: 'var(--color-success)',
  };

  // ── i18n getters ──

  get badgeLabel(): string {
    return this.store.isAgronomist()
      ? $localize`:@@rec.list.badge.agronomist:Segmento agronomo`
      : $localize`:@@rec.list.badge.grower:Segmento productor`;
  }

  get headingText(): string {
    return $localize`:@@rec.list.heading:Recomendaciones`;
  }

  get subtitleText(): string {
    return this.store.isAgronomist()
      ? $localize`:@@rec.list.subtitle.agronomist:Gestiona las recomendaciones agronomicas: revisa, aprueba y publica para tus productores.`
      : $localize`:@@rec.list.subtitle.grower:Consulta las recomendaciones agronomicas publicadas por tu agronomo.`;
  }

  get counterLabel(): string {
    return $localize`:@@rec.list.counter:recomendaciones`;
  }

  get tabPendingLabel(): string {
    return $localize`:@@rec.list.tab.pending:Pendientes`;
  }

  get tabPublishedLabel(): string {
    return $localize`:@@rec.list.tab.published:Publicadas`;
  }

  get newButtonLabel(): string {
    return $localize`:@@rec.list.newButton:+ Nueva`;
  }

  get loadingText(): string {
    return $localize`:@@rec.list.loading:Cargando recomendaciones...`;
  }

  get emptyPendingTitle(): string {
    return $localize`:@@rec.list.emptyPending:Sin pendientes`;
  }

  get emptyPendingDesc(): string {
    return $localize`:@@rec.list.emptyPendingDesc:No hay recomendaciones que requieran revision.`;
  }

  get emptyPublishedTitle(): string {
    return $localize`:@@rec.list.emptyPublished:Sin publicadas`;
  }

  get emptyPublishedDesc(): string {
    return $localize`:@@rec.list.emptyPublishedDesc:Aun no se han publicado recomendaciones.`;
  }

  get createFirstLabel(): string {
    return $localize`:@@rec.list.createFirst:Crear primera recomendacion`;
  }

  priorityLabel(key: string): string {
    const labels: Record<string, string> = {
      critical: $localize`:@@rec.list.priority.critical:Critica`,
      high: $localize`:@@rec.list.priority.high:Alta`,
      medium: $localize`:@@rec.list.priority.medium:Media`,
      low: $localize`:@@rec.list.priority.low:Baja`,
    };
    return labels[key] ?? key;
  }

  statusLabel(key: string): string {
    const labels: Record<string, string> = {
      draft: $localize`:@@rec.list.status.draft:Borrador`,
      pending_review: $localize`:@@rec.list.status.pendingReview:Pendiente`,
      approved: $localize`:@@rec.list.status.approved:Aprobada`,
      published: $localize`:@@rec.list.status.published:Publicada`,
    };
    return labels[key] ?? key;
  }

  ngOnInit(): void {
    this.load();
  }

  selectTab(tab: 'pending' | 'published'): void {
    this.activeTab.set(tab);
  }

  private load(): void {
    const params = this.store.isAgronomist()
      ? { size: 50 }
      : { status: 'published', size: 50 };
    this.store.loadRecommendations(params);
  }
}
