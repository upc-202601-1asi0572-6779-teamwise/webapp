import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SubscriptionAndUserManagementStore } from '../../../application/subscription-and-user-management.store';

@Component({
  selector: 'app-my-profile',
  imports: [ReactiveFormsModule, DatePipe, RouterLink],
  templateUrl: './my-profile.component.html',
})
export class MyProfileComponent implements OnInit {
  private readonly store = inject(SubscriptionAndUserManagementStore);
  private readonly fb = inject(FormBuilder);

  readonly user = this.store.user;
  readonly loading = this.store.profileLoading;
  readonly saving = this.store.profileSaving;
  readonly error = this.store.profileError;

  editing = false;

  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+51\s?\d{3}\s?\d{3}\s?\d{3}$/)]],
    region: ['', [Validators.required]],
    city: ['', [Validators.required]],
  });

  regions = ['Ucayali', 'San Martín', 'Loreto'];

  ngOnInit(): void {
    this.store.loadProfile();
  }

  startEdit(): void {
    const u = this.user();
    if (!u) return;
    this.form.patchValue({
      fullName: u.fullName,
      phone: u.phone,
      region: u.region,
      city: u.city,
    });
    this.editing = true;
    this.store.profileError.set('');
  }

  cancelEdit(): void {
    this.editing = false;
    this.store.profileError.set('');
  }

  save(): void {
    if (this.form.invalid) return;
    this.store.updateProfile(this.form.getRawValue()).subscribe({
      next: () => {
        this.editing = false;
      },
      error: () => {
        // Error already set by the store
      },
    });
  }
}
