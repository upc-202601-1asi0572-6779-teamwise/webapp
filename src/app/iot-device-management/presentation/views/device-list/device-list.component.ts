import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IotDeviceManagementStore } from '../../../application/iot-device-management.store';

@Component({
  selector: 'app-device-list',
  imports: [RouterLink],
  templateUrl: './device-list.component.html',
})
export class DeviceListComponent implements OnInit {
  private readonly store = inject(IotDeviceManagementStore);

  readonly selectedPlantationId = signal(0);

  // Proxy store signals so the template bindings remain unchanged
  readonly devices = this.store.devices;
  readonly plantations = this.store.plantations;
  readonly loading = this.store.devicesLoading;
  readonly error = this.store.devicesError;

  readonly filteredDevices = computed(() => {
    const plantationId = this.selectedPlantationId();
    const allDevices = this.devices();
    if (plantationId <= 0) return allDevices;
    return allDevices.filter((d) => d.plantationId === plantationId);
  });

  readonly connectivityColors: Record<string, string> = {
    connected: 'var(--color-success)',
    offline_mode: 'var(--color-warning)',
    disconnected: 'var(--color-danger)',
  };

  readonly connectivityLabels: Record<string, string> = {
    connected: 'Conectado',
    offline_mode: 'Modo offline',
    disconnected: 'Desconectado',
  };

  readonly healthColors: Record<string, string> = {
    healthy: 'var(--color-success)',
    warning: 'var(--color-warning)',
    critical: 'var(--color-danger)',
  };

  readonly healthLabels: Record<string, string> = {
    healthy: 'Saludable',
    warning: 'Atencion',
    critical: 'Critico',
  };

  ngOnInit(): void {
    this.store.loadDevices();
    this.store.loadPlantations();
  }
}
