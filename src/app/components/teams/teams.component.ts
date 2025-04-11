import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

// Importa le interfacce esistenti
import { Service } from '../../models/Service';
import { User } from '../../models/User';
import { Tooltip, TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';

// Estendi l'interfaccia Service per aggiungere i campi necessari
// senza modificare l'originale
interface ExtendedService extends Service {
  date: Date;
  description?: string;
  status: string;
}



@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // PrimeNG
    ButtonModule,
    TableModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    TagModule,
    AvatarModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    SelectButtonModule
  ],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class TeamsComponent implements OnInit {
  // Dati
  services: ExtendedService[] = [];
  volunteers: User[] = [];
  filteredServices: ExtendedService[] = [];
  filteredVolunteers: User[] = [];
  availableVolunteersForService: User[] = [];

  // Filtri
  selectedService: any = null;
  selectedDate: Date | null = null;
  selectedStatus: string | null = null;

  // Ricerche
  teamLeaderSearch: string = '';
  volunteerSearch: string = '';

  // Dialoghi
  serviceDialogVisible: boolean = false;
  teamLeaderDialogVisible: boolean = false;
  addVolunteerDialogVisible: boolean = false;
  editingService: ExtendedService | null = null;
  currentServiceForVolunteers: ExtendedService | null = null;

  // Dettagli servizio
  serviceDetailsVisible = false;

  // Form
  serviceForm: FormGroup;

  // Dropdown options
  statusOptions = [
    { label: 'In programmazione', value: 'planning' },
    { label: 'Confermato', value: 'confirmed' },
    { label: 'In corso', value: 'in_progress' },
    { label: 'Completato', value: 'completed' },
    { label: 'Annullato', value: 'cancelled' }
  ];

  roleOptions = [
    { label: 'Autista', value: 'driver' },
    { label: 'Soccorritore', value: 'rescuer' },
    { label: 'Barelliere', value: 'stretcher_bearer' },
    { label: 'Supporto', value: 'support' }
  ];

  dateSelectionMode: 'single' | 'range' | 'month' = 'single';
  dateSelectionTypes = [
    { label: 'Giorno', value: 'single' },
    { label: 'Intervallo', value: 'range' },
    { label: 'Mese', value: 'month' }
  ];
  dateRange: Date[] = [];
  selectedMonth: Date | null = null;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      date: [null, Validators.required],
      description: [''],
      status: ['planning', Validators.required]
    });
  }

  ngOnInit(): void {
    // In un'applicazione reale, qui andrebbero caricate le informazioni da un servizio
    this.loadMockData();
    this.applyFilters();
    // Inizializza filteredServices con tutti i servizi all'avvio
    this.filteredServices = [...this.services];
    // Imposta il filtro predefinito per mostrare solo i servizi del mese corrente
    this.applyDefaultFilters();
  }

  openNewServiceDialog(): void {
    this.editingService = null;
    this.serviceForm.reset({
      status: 'planning',
      date: new Date()
    });
    this.serviceDialogVisible = true;
  }

  editService(service: ExtendedService): void {
    this.editingService = { ...service };
    this.serviceForm.patchValue({
      name: service.name,
      date: new Date(service.date),
      description: service.description || '',
      status: service.status
    });
    this.serviceDialogVisible = true;
  }

  saveService(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const formValue = this.serviceForm.value;

    if (this.editingService) {
      // Aggiorna servizio esistente
      const index = this.services.findIndex(s => s.id === this.editingService!.id);
      if (index !== -1) {
        this.services[index] = {
          ...this.services[index],
          name: formValue.name,
          date: formValue.date,
          description: formValue.description,
          status: formValue.status
        };

        this.messageService.add({
          severity: 'success',
          summary: 'Operazione completata',
          detail: 'Servizio aggiornato con successo'
        });
      }
    } else {
      // Crea nuovo servizio
      const newService: ExtendedService = {
        id: this.generateId(),
        name: formValue.name,
        date: formValue.date,
        description: formValue.description,
        status: formValue.status,
        leader: null as any, // Sarà assegnato dopo
        volunteers: []
      };

      this.services.push(newService);
      this.messageService.add({
        severity: 'success',
        summary: 'Operazione completata',
        detail: 'Nuovo servizio creato'
      });
    }

    this.serviceDialogVisible = false;
    this.applyFilters();
  }

  confirmDeleteService(service: ExtendedService): void {
    this.confirmationService.confirm({
      message: `Sei sicuro di voler eliminare il servizio "${service.name}"?`,
      header: 'Conferma eliminazione',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.services = this.services.filter(s => s.id !== service.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Operazione completata',
          detail: 'Servizio eliminato'
        });
        this.applyFilters();
      }
    });
  }

  changeTeamLeader(service: ExtendedService): void {
    this.editingService = service;
    this.teamLeaderSearch = '';
    this.filteredVolunteers = [...this.volunteers];
    this.teamLeaderDialogVisible = true;
  }

  selectTeamLeader(volunteer: User): void {
    if (this.editingService) {
      const index = this.services.findIndex(s => s.id === this.editingService!.id);
      if (index !== -1) {
        this.services[index].leader = { ...volunteer };
        this.messageService.add({
          severity: 'success',
          summary: 'Team Leader',
          detail: `${volunteer.first_name} ${volunteer.last_name} assegnato come Team Leader`
        });
      }
    }
    this.teamLeaderDialogVisible = false;
    this.applyFilters();
  }

  addVolunteerToService(service: ExtendedService): void {
    this.currentServiceForVolunteers = service;
    this.volunteerSearch = '';

    // Filtra volontari non già presenti nel servizio
    const serviceVolunteerIds = new Set((service.volunteers || []).map(v => v.id));
    this.availableVolunteersForService = this.volunteers
      .filter(v => !serviceVolunteerIds.has(v.id))
      .map(v => ({...v, tempRole: ''}));

    this.addVolunteerDialogVisible = true;
  }

  addVolunteerWithRole(volunteer: User): void {
    if (this.currentServiceForVolunteers && volunteer.role) {
      const index = this.services.findIndex(s => s.id === this.currentServiceForVolunteers!.id);

      if (index !== -1) {
        if (!this.services[index].volunteers) {
          this.services[index].volunteers = [];
        }

        // Crea una copia con il ruolo assegnato
        const volunteerWithRole: User = {
          ...volunteer,
          role: volunteer.role
        };

        this.services[index].volunteers.push(volunteerWithRole);

        this.messageService.add({
          severity: 'success',
          summary: 'Volontario aggiunto',
          detail: `${volunteer.first_name} ${volunteer.last_name} aggiunto al servizio`
        });

        // Aggiorna la lista dei volontari disponibili
        this.availableVolunteersForService = this.availableVolunteersForService.filter(
          v => v.id !== volunteer.id
        );
      }
    }
  }

  editVolunteerRole(service: ExtendedService, volunteer: User): void {
    // Implementazione per modificare il ruolo di un volontario
    // Questa potrebbe essere una dialog simile per la selezione del ruolo
    console.log('Edit volunteer role:', service.id, volunteer.id);
  }

  removeVolunteer(service: ExtendedService, volunteer: User): void {
    this.confirmationService.confirm({
      message: `Sei sicuro di voler rimuovere ${volunteer.first_name} ${volunteer.last_name} dal servizio?`,
      header: 'Conferma rimozione',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const serviceIndex = this.services.findIndex(s => s.id === service.id);
        if (serviceIndex !== -1 && this.services[serviceIndex].volunteers) {
          this.services[serviceIndex].volunteers = this.services[serviceIndex].volunteers!.filter(
            v => v.id !== volunteer.id
          );

          this.messageService.add({
            severity: 'success',
            summary: 'Volontario rimosso',
            detail: `${volunteer.first_name} ${volunteer.last_name} rimosso dal servizio`
          });
          this.applyFilters();
        }
      }
    });
  }

  getStatusSeverity(status: string) {
    switch (status) {
      case 'planning': return 'info';
      case 'confirmed': return 'success';
      case 'in_progress': return 'warn';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  }

  openVolunteerModal(): void {
    // Questa funzionalità sarà implementata in un altro componente
    this.messageService.add({
      severity: 'info',
      summary: 'Funzionalità esterna',
      detail: 'La gestione dettagliata dei volontari sarà implementata in un altro componente'
    });
  }

  applyFilters(): void {
    this.filteredServices = [...this.services]; // copia iniziale

    // Filtra per servizio se selezionato
    if (this.selectedService) {
      this.filteredServices = this.filteredServices.filter(s => s.id === this.selectedService);
    }

    // Filtra per data in base alla modalità di selezione
    if (this.dateSelectionMode === 'single' && this.selectedDate) {
      // Filtra per data singola
      this.filteredServices = this.filteredServices.filter(s => {
        const serviceDate = new Date(s.date);
        const filterDate = new Date(this.selectedDate!);
        return serviceDate.toDateString() === filterDate.toDateString();
      });
    } else if (this.dateSelectionMode === 'range' && this.dateRange?.length === 2) {
      // Filtra per intervallo date
      const startDate = new Date(this.dateRange[0]);
      const endDate = new Date(this.dateRange[1]);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      this.filteredServices = this.filteredServices.filter(s => {
        const serviceDate = new Date(s.date);
        return serviceDate >= startDate && serviceDate <= endDate;
      });
    } else if (this.dateSelectionMode === 'month' && this.selectedMonth) {
      // Filtra per mese
      const month = this.selectedMonth.getMonth();
      const year = this.selectedMonth.getFullYear();

      this.filteredServices = this.filteredServices.filter(s => {
        const serviceDate = new Date(s.date);
        return serviceDate.getMonth() === month && serviceDate.getFullYear() === year;
      });
    }

    // Continua con altri filtri se presenti
    if (this.selectedStatus) {
      this.filteredServices = this.filteredServices.filter(s => s.status === this.selectedStatus);
    }
  }

  resetFilters(): void {
    this.selectedService = null;
    this.selectedDate = null;
    this.selectedStatus = null;

    // Torna alla vista predefinita (mese corrente)
    this.applyDefaultFilters();
  }

  showServiceDetails(service: any): void {
    this.selectedService = service;
    this.serviceDetailsVisible = true;
  }

  // Utility methods
  generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  }

  loadMockData(): void {
    // Dati di esempio per lo sviluppo
    this.volunteers = [
       {
      id: 'v1',
      first_name: 'Mario',
      last_name: 'Rossi',
      contact: '333 1234567',
      email: 'mario.rossi@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1' // Avatar casuale
    },
    {
      id: 'v2',
      first_name: 'Laura',
      last_name: 'Bianchi',
      contact: '333 7654321',
      email: 'laura.bianchi@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5' // Avatar casuale
    },
    {
      id: 'v3',
      first_name: 'Giovanni',
      last_name: 'Verdi',
      contact: '333 9876543',
      email: 'giovanni.verdi@example.com',
      avatar: 'https://i.pravatar.cc/150?img=12' // Avatar casuale
    },
    {
      id: 'v4',
      first_name: 'Anna',
      last_name: 'Neri',
      contact: '333 1122334',
      email: 'anna.neri@example.com',
      avatar: 'https://i.pravatar.cc/150?img=20' // Avatar casuale
    },
    {
      id: 'v5',
      first_name: 'Marco',
      last_name: 'Gialli',
      contact: '333 5566778',
      email: 'marco.gialli@example.com',
      avatar: 'https://i.pravatar.cc/150?img=33' // Avatar casuale
    }
    ];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    this.services = [
      {
        id: 's1',
        name: 'Assistenza Evento Sportivo',
        date: tomorrow,
        description: 'Supporto sanitario per gara podistica',
        status: 'confirmed',
        leader: this.volunteers[0],
        volunteers: [
          { ...this.volunteers[1], role: 'volontario' },
          { ...this.volunteers[2], role: 'volontario' }
        ]
      },
      {
        id: 's2',
        name: 'Trasporto Sanitario',
        date: nextWeek,
        description: 'Trasporto paziente dializzato',
        status: 'planning',
        leader: this.volunteers[1],
        volunteers: []
      }
    ];
  }

  onDateSelectionModeChange() {
    // Resetta i valori quando si cambia modalità
    this.selectedDate = null;
    this.dateRange = [];
    this.selectedMonth = null;
  }

  // Metodo per applicare i filtri predefiniti (solo mese corrente, tutti gli stati)
  applyDefaultFilters() {
    // Filtro per il mese corrente
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    this.filteredServices = this.services.filter(service => {
      const serviceDate = new Date(service.date);
      return serviceDate.getMonth() === currentMonth &&
             serviceDate.getFullYear() === currentYear;
    });
  }
}
