import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react' 
import dayGridPlugin from '@fullcalendar/daygrid' 
import interactionPlugin from "@fullcalendar/interaction" 
import DatePicker from 'react-datepicker'; 
import { Modal, Button } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.css';
import 'react-notifications/lib/notifications.css';
import './App.css';

export default class App extends React.Component { 
  
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      role: "admin",
      editable_boolean: false,
      events: [
        { id: 11, title: 'Contentieux Dupond', description: 'description1', date: '2022-01-01 01:30' },
        { id: 22, title: 'Assise Jean', description: 'description2', date: '2022-01-01 02:30' }
      ],
      modal: null,
      datePicker: null
    }    

    //Gestion des roles utilisateurs
    this.state.editable_boolean = this.state.role === "admin" ? true : false

    //Binding des evenements
    this.changeObjEventModal = this.changeObjEventModal.bind(this);
    this.openCloseModal = this.openCloseModal.bind(this);
    this.dayClick = this.dayClick.bind(this);
    this.eventClick = this.eventClick.bind(this);
    this.eventDrop = this.eventDrop.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeDatePicker = this.changeDatePicker.bind(this);
    this.createNotification = this.createNotification.bind(this);
  }

  //Notifications
  createNotification = (type, message) => {
    switch (type) {
      case 'info':
        NotificationManager.info(message);
        break;
      case 'success': 
        NotificationManager.success('', message, 3000);
        break;
      case 'warning':
        NotificationManager.warning('', message, 3000);
        break;
      case 'error':
        NotificationManager.error('', message, 3000);
        break;
    }
  }

  //Binding de l'objet Event de la modal
  changeObjEventModal = (event) => {
    this.state.modal.item[event.target.name] = event.target.value
  }

  //Ouverture/Fermeture de la modal
  openCloseModal = (arg = false) => {
    this.setState({ show: arg });
    
    if (!arg) { this.state.modal = null }
  }

  //Clic sur le jour du calendrier
  dayClick = (arg) => { 
    this.state.modal = {
      ...this.state.modal, 
      item: { date: arg.dateStr },
      title: "Ajout d'un évènement"
    }
    this.setState({ datePicker: new Date(arg.date) });

    this.openCloseModal(true)
  };

  //Clic sur un Event du calendrier
  eventClick = (info) => { 
    if (this.state.role === "admin") {
      this.state.modal = {
        title : "Modification de l'évènement"
      }
    } else {
      this.state.modal = {
        title : "Evènement"
      }
    }

    //Hydratation de l'objet Event dans formulaire de la Modal
    let event = this.state.events.find(item => item.id == info.event._def.publicId)
    this.state.modal = { ...this.state.modal, item: event }

    //Cas particulier de la date qui doit etre setter
    this.setState({ datePicker: new Date(this.state.modal.item.date) });

    this.openCloseModal(true)
  };

  //Drag drop event
  eventDrop = (info) => {

    if (!window.confirm("Are you sure about this change?")) {
      info.revert();
    } else {
      //TODO : Mise a jour en base de la date de l'event
      let date_end = info.event.start
    }
  };

  //Ajout/Mise a jour d'un Event
  handleSubmit = (event) => {

    event.preventDefault()
    
    //Mise a jour
    if (this.state.modal.item.id) {
    
      let findIndex = this.state.events.findIndex(item => item.id == this.state.modal.item.id)
      this.state.events[findIndex] = this.state.modal.item
      let newEvent = [...this.state.events]

      this.setState({ events: newEvent });

    } else {
      //Ajout
      const newEvent = {
        id: 1,
        title: this.state.modal.item.title,
        description: this.state.modal.item.description,
        date: this.state.modal.item.date
      };
      const data = [...this.state.events, newEvent];

      this.setState({ events: data });
    }   

    this.openCloseModal(false)     
    
    if (1==1) {
      this.createNotification("success", "L'évènement est enregistré avec succès.")
    } else {
      this.createNotification("warning", "Une erreur est survenue lors de l'enregistrement. Si le problème persiste, veuillez contacter le support.")
    }
    
  };

  //Formattage du datePicker pour l'objet Event Modal
  //Mise a jour de l'objet Modal 
  changeDatePicker = (date) => {  
    this.state.modal.item.date = moment(date).format('YYYY-MM-DD hh:mm')
    this.setState({ datePicker: date })
    this.setState({ modal: this.state.modal })
  }

  render() {      
    return (
      <>
        <div className='container'>
          <NotificationContainer/>

          <Modal show={this.state.show} onHide={this.openCloseModal}>
            <form onSubmit={this.handleSubmit}>
              <Modal.Header closeButton>  
                <Modal.Title>{this.state.modal ? this.state.modal.title : ""}</Modal.Title>
              </Modal.Header>
              <Modal.Body>              
                <input type='hidden' 
                      className="form-control"
                      defaultValue={this.state.modal ? this.state.modal.item.id : ""} 
                      disabled={this.state.role === 'admin' ? '' : 'disabled'} />
                <span>Date : </span>
                <DatePicker                    
                    className="form-control" 
                    selected={ this.state.datePicker }
                    onChange={ this.changeDatePicker }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={5}
                    timeCaption="time"
                    dateFormat="dd/MM/Y HH:mm"
                />
                <span>Evenement :</span>
                <input type='text' 
                      name="title" 
                      className="form-control" 
                      onChange={this.changeObjEventModal} 
                      defaultValue={this.state.modal ? this.state.modal.item.title : ""} 
                      disabled={this.state.role === 'admin' ? '' : 'disabled'}/>
                <span>Description</span> 
                <input type='text' 
                      name="description" 
                      className="form-control" 
                      onChange={this.changeObjEventModal} 
                      defaultValue={this.state.modal ? this.state.modal.item.description : ""} 
                      disabled={this.state.role === 'admin' ? '' : 'disabled'}/>
                               
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" type="submit" value="Envoyer" >
                  Save
                </Button>
                <Button variant="danger">
                  Delete
                </Button>
              </Modal.Footer>
            </form>
          </Modal>

          <FullCalendar
            locale= 'fr'
            plugins={[ dayGridPlugin, interactionPlugin ]}
            dateClick={this.dayClick}
            eventClick={this.eventClick} 
            initialView='dayGridMonth'      
            headerToolbar={{
              left: "prev,today,next",
              center: "title",
              right: "dayGridMonth,dayGrid"
            }}
            buttonText={{
              today:    "Mois en cours",
              month:    "Mois",
              week:     "Semaine",
              day:      "Jour",
              dayGrid:  "Aujourd'hui"
            }}
            editable={this.state.editable_boolean}
            eventDrop={this.eventDrop}
            events={this.state.events}
          />
        </div>
      </>
    );    
  }  
}
