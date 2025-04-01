import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';

// Models
import { Event, EventCategory } from '../../models/Event';
import { User } from '../../models/User';
import { Service } from '../../models/Service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectButtonModule,
    CalendarModule,
    CheckboxModule,
    DialogModule,
    AccordionModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  // Dati di base calendario
  currentDate: Date = new Date();
  datePicker: Date = new Date();
  currentView: string = 'month';


  weekDays: string[] = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);

  monthDates: Date[] = [];
  weekDates: Date[] = [];

  // Eventi e categorie
  events: Event[] = [];
  eventCategories: EventCategory[] = [];
  upcomingEvents: Event[] = [];

  // Dialog
  showDialog: boolean = false;
  selectedEvent: Event | null = null;

  get currentViewTitle(): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric'
    };

    if (this.currentView === 'week') {
      const startDate = this.weekDates[0];
      const endDate = this.weekDates[6];

      if (!startDate || !endDate) return '';

      if (startDate.getMonth() === endDate.getMonth()) {
        return `${startDate.getDate()} - ${endDate.getDate()} ${startDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}`;
      } else if (startDate.getFullYear() === endDate.getFullYear()) {
        return `${startDate.getDate()} ${startDate.toLocaleDateString('it-IT', { month: 'long' })} - ${endDate.getDate()} ${endDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}`;
      } else {
        return `${startDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })} - ${endDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}`;
      }
    }

    return this.currentDate.toLocaleDateString('it-IT', options);
  }

  constructor() {}

  ngOnInit(): void {
    this.loadMockData();
    this.generateCalendarData();
    this.updateUpcomingEvents();
  }

  loadMockData(): void {
    // Categorie di eventi
    this.eventCategories = [
      { id: "1", name: 'Evangelizzazione', color: '#FF6B6B', visible: true },
      { id: "2", name: 'Liturgia', color: '#4ECDC4', visible: true },
      { id: "3", name: 'Formazione', color: '#FFD166', visible: true },
      { id: "4", name: 'Comunità', color: '#6A0572', visible: true }
    ];

    // Usere
    const Usere: User[] = [
      {
        id: "1", name: 'Mario Rossi',
        email: '',
        password: '',
        passwordConfirm: '',
        first_name: '',
        last_name: '',
        role: 'admin'
      },
      {
        id: "2", name: 'Laura Bianchi',
        email: '',
        password: '',
        passwordConfirm: '',
        first_name: '',
        last_name: '',
        role: 'admin'
      },
      {
        id: "3", name: 'Giovanni Verdi',
        email: '',
        password: '',
        passwordConfirm: '',
        first_name: '',
        last_name: '',
        role: 'admin'
      },
      {
        id: "4", name: 'Paola Neri',
        email: '',
        password: '',
        passwordConfirm: '',
        first_name: '',
        last_name: '',
        role: 'admin'
      },
      {
        id: "5", name: 'Luca Gialli',
        email: '',
        password: '',
        passwordConfirm: '',
        first_name: '',
        last_name: '',
        role: 'admin'
      },
      {
        id: "6", name: 'Anna Blu',
        email: '',
        password: '',
        passwordConfirm: '',
        first_name: '',
        last_name: '',
        role: 'admin'
      },
      {
        id: "7", name: 'Sara Viola',
        email: '',
        password: '',
        passwordConfirm: '',
        first_name: '',
        last_name: '',
        role: 'admin'
      },
      {
        id: "8", name: 'Marco Marrone',
        email: '',
        password: '',
        passwordConfirm: '',
        first_name: '',
        last_name: '',
        role: 'admin'
      },
      {
        id: "9", name: 'Elena Rosa',
        email: '',
        password: '',
        passwordConfirm: '',
        first_name: '',
        last_name: '',
        role: 'admin'
      },
      {
        id: "10", name: 'Davide Azzurro',
        email: '',
        password: '',
        passwordConfirm: '',
        first_name: '',
        last_name: '',
        role: 'admin'
      }
    ];

    // Eventi con servizi
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    this.events = [
      {
        id: "1",
        title: 'Incontro Giovani',
        start: new Date(currentYear, currentMonth, 10, 18, 0),
        end: new Date(currentYear, currentMonth, 10, 20, 0),
        color: '#FF6B6B',
        description: 'Incontro formativo con i giovani della comunità',
        categoryId: "1",
        services: [
          {
            id: "101",
            name: 'Accoglienza',
            leader: Usere[0],
            volunteers: [Usere[1], Usere[2]]
          },
          {
            id: "102",
            name: 'Animazione',
            leader: Usere[3],
            volunteers: [Usere[4], Usere[5]]
          }
        ]
      },
      {
        id: "2",
        title: 'Messa Comunitaria',
        start: new Date(currentYear, currentMonth, 15, 10, 0),
        end: new Date(currentYear, currentMonth, 15, 12, 0),
        color: '#4ECDC4',
        description: 'Celebrazione eucaristica settimanale',
        categoryId: "2",
        services: [
          {
            id: "201",
            name: 'Liturgia',
            leader: Usere[6],
            volunteers: [Usere[7], Usere[8]]
          },
          {
            id: "202",
            name: 'Coro',
            leader: Usere[9],
            volunteers: [Usere[0], Usere[2], Usere[4]]
          }
        ]
      },
      {
        id: "3",
        title: 'Formazione Catechisti',
        start: new Date(currentYear, currentMonth, 5, 16, 0),
        end: new Date(currentYear, currentMonth, 5, 18, 30),
        color: '#FFD166',
        description: 'Incontro formativo per i catechisti della parrocchia',
        categoryId: "3",
        services: [
          {
            id: "301",
            name: 'Organizzazione',
            leader: Usere[1],
            volunteers: [Usere[3], Usere[5]]
          }
        ]
      },
      {
        id: "4",
        title: 'Cena Comunitaria',
        start: new Date(currentYear, currentMonth, 20, 19, 30),
        end: new Date(currentYear, currentMonth, 20, 22, 0),
        color: '#6A0572',
        description: 'Cena di condivisione tra i membri della comunità',
        categoryId: "4",
        services: [
          {
            id: "401",
            name: 'Cucina',
            leader: Usere[2],
            volunteers: [Usere[4], Usere[6], Usere[8]]
          },
          {
            id: "402",
            name: 'Servizio Tavoli',
            leader: Usere[7],
            volunteers: [Usere[9], Usere[1], Usere[3]]
          },
          {
            id: "403",
            name: 'Pulizie',
            leader: Usere[5],
            volunteers: [Usere[0], Usere[2]]
          }
        ]
      },
      {
        id: "5",
        title: 'Ritiro Spirituale',
        start: new Date(currentYear, currentMonth, 25, 9, 0),
        end: new Date(currentYear, currentMonth, 26, 18, 0),
        color: '#FF6B6B',
        description: 'Ritiro spirituale di due giorni con meditazioni e preghiera',
        categoryId: "1",
        services: [
          {
            id: "501",
            name: 'Coordinamento',
            leader: Usere[0],
            volunteers: [Usere[2], Usere[4], Usere[6]]
          },
          {
            id: "502",
            name: 'Logistica',
            leader: Usere[8],
            volunteers: [Usere[1], Usere[3], Usere[5]]
          }
        ]
      }
    ];

    // Aggiungiamo altri eventi nell'arco di 3 mesi
    for (let i = 0; i < 20; i++) {
      const randomDay = Math.floor(Math.random() * 90) - 30; // Da -30 a +60 giorni
      const randomCategoryId = Math.floor(Math.random() * 4) + 1;
      const category = this.eventCategories.find(c => c.id === randomCategoryId.toString());
      const randomHour = Math.floor(Math.random() * 12) + 8; // 8:00 - 20:00
      const randomDuration = Math.floor(Math.random() * 3) + 1; // 1-3 ore

      const start = new Date(currentYear, currentMonth, now.getDate() + randomDay, randomHour, 0);
      const end = new Date(start);
      end.setHours(start.getHours() + randomDuration);

      const randomServiceCount = Math.floor(Math.random() * 3) + 1;
      const services: Service[] = [];

      for (let j = 0; j < randomServiceCount; j++) {
        const randomLeaderIndex = Math.floor(Math.random() * Usere.length);
        const randomVolunteerCount = Math.floor(Math.random() * 4) + 1;
        const volunteers: User[] = [];

        for (let k = 0; k < randomVolunteerCount; k++) {
          let randomVolunteerIndex;
          do {
            randomVolunteerIndex = Math.floor(Math.random() * Usere.length);
          } while (randomVolunteerIndex === randomLeaderIndex);

          volunteers.push(Usere[randomVolunteerIndex]);
        }

        services.push({
          id: "1000" + i * 10 + j,
          name: `Servizio ${j + 1}`,
          leader: Usere[randomLeaderIndex],
          volunteers: volunteers
        });
      }

      this.events.push({
        id: "10" + i,
        title: `Evento ${i + 6}`,
        start,
        end,
        color: category?.color || '#999',
        description: `Descrizione dell'evento ${i + 6}`,
        categoryId: "randomCategoryId",
        services
      });
    }
  }

  generateCalendarData(): void {
    this.generateMonthDates();
  }

  generateMonthDates(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Primo giorno del mese
    const firstDay = new Date(year, month, 1);
    // Ultimo giorno del mese
    const lastDay = new Date(year, month + 1, 0);

    // Giorno della settimana del primo giorno (0 = Domenica, 6 = Sabato)
    const firstDayOfWeek = firstDay.getDay();

    // Data di inizio del calendario (può essere del mese precedente)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDayOfWeek);

    // Calcola il numero di righe necessarie
    // Numero di giorni nel mese + offset del primo giorno della settimana
    const daysInMonth = lastDay.getDate();
    const totalDaysToShow = daysInMonth + firstDayOfWeek;
    // Se il totale supera 35, abbiamo bisogno di 6 righe, altrimenti 5
    const numRows = Math.ceil(totalDaysToShow / 7);
    const totalDates = numRows * 7;

    // Generiamo il numero giusto di date (5 o 6 righe × 7 colonne)
    this.monthDates = [];
    for (let i = 0; i < totalDates; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      this.monthDates.push(date);
    }
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  getDayName(date: Date): string {
    return this.weekDays[date.getDay()];
  }

  navigatePrevious(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendarData();
    this.updateUpcomingEvents();
  }

  navigateNext(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendarData();
    this.updateUpcomingEvents();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.generateCalendarData();
    this.updateUpcomingEvents();
  }

  onViewChange(): void {
    this.generateCalendarData();
  }

  onDateSelect(date: Date): void {
    this.currentDate = date;
    this.generateCalendarData();
    this.updateUpcomingEvents();
  }

  getEventsForDate(date: Date): Event[] {
    // Filtriamo gli eventi per la data specificata
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return this.events
      .filter(event => {
        return event.start >= dayStart && event.start <= dayEnd &&
               this.eventCategories.find(c => c.id === event.categoryId)?.visible;
      })
      .slice(0, 4); // Limitiamo a 3 eventi visibili + "più altri"
  }

  updateUpcomingEvents(): void {
    const now = new Date();

    // Filtriamo gli eventi futuri, ordinati per data
    this.upcomingEvents = this.events
      .filter(event => event.start >= now)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 5); // Limitiamo a 5 eventi
  }

  showEventDetails(event: Event, $event?: MouseEvent): void {
    if ($event) {
      $event.stopPropagation();
    }

    this.selectedEvent = event;
    this.showDialog = true;
  }

  formatEventDate(event: Event): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    };

    if (this.isSameDay(event.start, event.end)) {
      // Stesso giorno
      return `${event.start.toLocaleDateString('it-IT', options)}, ${this.formatTime(event.start)} - ${this.formatTime(event.end)}`;
    } else {
      // Più giorni
      return `${event.start.toLocaleDateString('it-IT', options)} - ${event.end.toLocaleDateString('it-IT', options)}`;
    }
  }

  formatEventTime(event: Event): string {
    return `${this.formatTime(event.start)} - ${this.formatTime(event.end)}`;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  getEventColor(event: Event): string {
    return event.color || '#999';
  }

}
