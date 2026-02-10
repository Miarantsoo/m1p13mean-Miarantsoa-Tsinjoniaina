import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {PlanningService} from '@/modules/admin/planning/services/planning.service';

@Component({
  selector: 'app-planning',
  standalone: false,
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: 'fr',

    slotMinTime: '08:00:00',
    slotMaxTime: '17:30:00',

    slotDuration: '00:30:00',
    slotLabelInterval: '00:30',

    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '08:00',
      endTime: '17:00'
    },

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },

    events: [],

    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  };

  constructor(private planningService: PlanningService) {}

  ngOnInit(): void {
    this.planningService.getPlannings().subscribe(plannings => {
      this.calendarOptions = {
        ...this.calendarOptions,
        events: plannings.map(p => {
          const start = new Date(p.date);
          const end = new Date(start);
          end.setMinutes(end.getMinutes() + p.duration);

          return {
            title: p.shop_request.name,
            start,
            end,
            extendedProps: {
              image: p.shop_request.image_link,
              name: p.shop_request.name,
              email: p.shop_request.email
            }
          };
        }),
        eventClick: this.onEventClick.bind(this)
      };
    });
  }

  selectedEvent: any = null;

  onEventClick(info: any) {
    this.selectedEvent = {
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      image: info.event.extendedProps.image,
      name: info.event.extendedProps.name
    };
  }
}
