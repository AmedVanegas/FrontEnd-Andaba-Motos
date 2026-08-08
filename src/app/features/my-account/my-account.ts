import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import {
  getCountries,
  getStatesOfCountry,
  getCitiesOfState,
  type ICountry,
  type IState,
  type ICity,
} from '@countrystatecity/countries-browser';
import { HttpAuth } from '../../core/services/http-auth';
import { HttpUsers } from '../../core/services/http-users';

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  if (!pass && !confirm) return null;
  return pass === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './my-account.html',
  styleUrl: './my-account.css',
})
export default class  MyAccount implements OnInit {
  private fb = inject(FormBuilder);
  private httpAuth = inject(HttpAuth);
  private httpUsers = inject(HttpUsers);

  loading = true;
  saving = false;
  feedback: { type: 'success' | 'error'; message: string } | null = null;
  activeTab: 'perfil' | 'direccion' | 'seguridad' = 'perfil';

  tabs = [
    { id: 'perfil' as const, label: 'Perfil' },
    { id: 'direccion' as const, label: 'Dirección' },
    { id: 'seguridad' as const, label: 'Seguridad' },
  ];

  get tabIndex(): number {
    return this.tabs.findIndex((t) => t.id === this.activeTab);
  }

  userId: string | null = null;
  roleLabel = '';
  memberSince = '';
  documentNumber = '';
  birthDateDisplay = '';

  // Variables adaptadas al modelo asincrónico de user-form
  countriesList: ICountry[] = [];
  statesList: IState[] = [];
  citiesList: ICity[] = [];
  private selectedCountryIso = '';
  private selectedStateIso = '';

  form: FormGroup = this.fb.group({
    perfil: this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      middleName: ['', Validators.maxLength(50)],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      secondLastName: ['', Validators.maxLength(50)],
      username: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.maxLength(13)]],
      email: ['', [Validators.required, Validators.email]],
    }),
    direccion: this.fb.group({
      country: ['', Validators.required],
      department: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      carrera: ['', Validators.required],
      neighborhood: ['', Validators.required],
    }),
    seguridad: this.fb.group(
      {
        newPassword: ['', [Validators.minLength(8)]],
        confirmPassword: [''],
      },
      { validators: passwordsMatchValidator },
    ),
  });

  get perfil() {
    return this.form.get('perfil') as FormGroup;
  }
  get direccion() {
    return this.form.get('direccion') as FormGroup;
  }
  get seguridad() {
    return this.form.get('seguridad') as FormGroup;
  }

  get initials(): string {
    const f = this.perfil.value.firstName?.[0] ?? '';
    const l = this.perfil.value.lastName?.[0] ?? '';
    return (f + l).toUpperCase() || '?';
  }

  ngOnInit(): void {
    this.loadCountries();
    this.httpAuth.user$.subscribe((user: any) => {
      if (!user?._id) return;
      this.userId = user._id;
      this.fetchUser(user._id);
    });
  }

  selectTab(id: 'perfil' | 'direccion' | 'seguridad') {
    this.activeTab = id;
  }

  async loadCountries() {
    this.countriesList = await getCountries();
  }

  private fetchUser(userId: string) {
    this.loading = true;
    this.httpUsers.getUserById(userId).subscribe({
      next: async (res: any) => {
        await this.populateForm(res?.data ?? res);
      },
      error: () => {
        this.loading = false;
        this.feedback = { type: 'error', message: 'No pudimos cargar tu información. Intenta de nuevo.' };
      },
    });
  }

  private async populateForm(userData: any) {
    this.roleLabel = this.mapRole(userData?.rol);
    this.memberSince = this.formatMonthYear(userData?.createdAt);
    this.documentNumber = userData?.document ?? '—';
    this.birthDateDisplay = this.formatDate(userData?.birthDate);

    this.perfil.patchValue({
      firstName: userData?.firstName,
      middleName: userData?.middleName,
      lastName: userData?.lastName,
      secondLastName: userData?.secondLastName,
      username: userData?.username,
      phoneNumber: userData?.phoneNumber,
      email: userData?.email,
    });
    await this.syncAddressLocation(userData?.address);

    this.direccion.patchValue({
      country: userData?.address?.country ?? '',
      department: userData?.address?.department ?? '',
      city: userData?.address?.city ?? '',
      street: userData?.address?.street ?? '',
      carrera: userData?.address?.carrera ?? '',
      neighborhood: userData?.address?.neighborhood ?? '',
    });

    this.form.markAsPristine();
    this.loading = false;
  }

  async syncAddressLocation(address: any) {
    if (!address) return;

    this.countriesList = await getCountries();

    const matchedCountry = this.countriesList.find(
      (c) => c.name.toLowerCase() === (address.country ?? '').toLowerCase(),
    );
    if (!matchedCountry) return;
    this.selectedCountryIso = matchedCountry.iso2;

    this.statesList = await getStatesOfCountry(matchedCountry.iso2);

    const matchedState = this.statesList.find(
      (s) => s.name.toLowerCase() === (address.department ?? '').toLowerCase(),
    );
    if (!matchedState) return;
    this.selectedStateIso = matchedState.iso2;

    this.citiesList = await getCitiesOfState(matchedCountry.iso2, matchedState.iso2);
  }

  async onCountryChange(countryName: string, resetChildren = true) {
    const country = this.countriesList.find((c) => c.name === countryName);
    this.selectedCountryIso = country?.iso2 ?? '';

    if (resetChildren) {
      this.selectedStateIso = '';
      this.direccion.patchValue({ department: '', city: '' });
      this.statesList = [];
      this.citiesList = [];
    }

    if (this.selectedCountryIso) {
      this.statesList = await getStatesOfCountry(this.selectedCountryIso);
    }
  }

  async onStateChange(departmentName: string, resetChildren = true) {
    const state = this.statesList.find((s) => s.name === departmentName);
    this.selectedStateIso = state?.iso2 ?? '';

    if (resetChildren) {
      this.direccion.patchValue({ city: '' });
      this.citiesList = [];
    }

    if (this.selectedCountryIso && this.selectedStateIso) {
      this.citiesList = await getCitiesOfState(this.selectedCountryIso, this.selectedStateIso);
    }
  }

  onCityChange(name: string) {
    this.direccion.patchValue({ city: name });
  }

  save() {
    if (this.form.invalid || !this.userId) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.feedback = null;

    const payload: any = {
      ...this.perfil.value,
      address: { ...this.direccion.value },
    };

    const newPassword = this.seguridad.value.newPassword;
    if (newPassword) {
      payload.password = newPassword;
    }

    this.httpUsers.editUserbyId(this.userId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.feedback = { type: 'success', message: 'Tus datos se actualizaron correctamente.' };
        this.seguridad.reset({ newPassword: '', confirmPassword: '' });
        this.form.markAsPristine();
        setTimeout(() => (this.feedback = null), 4000);
      },
      error: (err) => {
        this.saving = false;
        this.feedback = {
          type: 'error',
          message: err?.error?.message ?? 'No pudimos guardar los cambios. Intenta de nuevo.',
        };
      },
    });
  }

  discardChanges() {
    if (!this.userId) return;
    this.fetchUser(this.userId);
  }

  private mapRole(rol: string): string {
    const map: Record<string, string> = {
      admin: 'Administrador',
      owner: 'Propietario',
      employee: 'Empleado',
      client: 'Cliente',
    };
    return map[rol] ?? rol ?? '';
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  private formatMonthYear(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' });
  }
}