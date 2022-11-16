/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/**
 * Copyright © 2021 Aditya Sharoff, Gregory Hairfeld, Jesse Coyle, Francis Phan, William Papsco, Jack Sherman, Geoffrey Corvera
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {createSlice, createAsyncThunk, PayloadAction, CaseReducer} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import format from 'date-fns/format';
import {bound, titleCase} from '../../../../utils/arrays';

/**
 * Amount of tickets in the cart
 *
 * @module
 * @param {number} product_id - references state.tickets.event_instance_id
 * @param {number} qty - amount of that product (tickets)
 * @param {string} name - name of the event/ticket for the event
 * @param {string} desc - description of the event
 * @param {string} product_img_url - URL to what the ticket looks like
 * @param {number} price - listed in dollars, like 60
 */
export interface CartItem {
    product_id: number, // references state.tickets.event_instance_id
    qty: number,
    name: string,
    desc: string,
    product_img_url: string,
    price: number,
}

/**
 * Ticket item itself
 *
 * @module
 * @param {number} event_instance_id
 * @param {string} eventid
 * @param {string} admission_type - default is 'General Admission' type tickets
 * @param {Date} date - date format
 * @param {number} ticket_price - A number for the ticket price
 * @param {number} concession_price
 * @param {number} totalseats? - the total amount of seats available
 * @param {number} availableseats - amount of leftover seats, gets subtracted when people buy
 */
export interface Ticket {
    event_instance_id: number,
    eventid: string,
    admission_type: 'General Admission',
    date: Date,
    ticket_price: number,
    concession_price: number,
    totalseats?: number,
    availableseats: number,
}

/**
 * The interface for event
 *
 * @module
 * @param {string} id - Event id
 * @param {string} title - title of event showing
 * @param {string} description
 * @param {string} image_url
 */
export interface Event {
    id: string,
    title: string,
    description: string,
    image_url: string,
}

type TicketsState = {byId: {[key: string]: Ticket}, allIds: number[]}
/**
 * Four states - 'idle', 'loading', 'success', 'failed'
 *
 * @module
 */
export type LoadStatus = 'idle' | 'loading' | 'success' | 'failed'

/**
 * Used to manage the ticketing states
 *
 * @module
 * @param {Array} cart - Array called CartItem
 * @param {Array} tickets - TicketsState has a key(string), byId(ticket), allIds is a number array
 * @param {Array} events - Event Array
 * @param {Array} status - Array of different loading states
 */
export interface ticketingState {
    cart: CartItem[],
    tickets: TicketsState,
    events: Event[],
    status: LoadStatus,
}

/**
 *
 * @param {string} url - gets data
 * @returns Error message on fail, otherwise gets message
 */
const fetchData = async (url: string) => {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error(err.message);
  }
};

/**
 * Fetches all the data, and gets all the api routes then prints to console
 *
 * @module
 * @returns {Array} events, tickets, byID, allIds
 */
export const fetchTicketingData = createAsyncThunk(
    'ticketing/fetch',
    async () => {
      const eventData = await fetchData(process.env.REACT_APP_ROOT_URL + '/api/events');
      const events: Event[] = eventData.data;
      const ticketRes: TicketsState = await fetchData(process.env.REACT_APP_ROOT_URL + '/api/tickets');
      const tickets = Object.entries(ticketRes.byId).reduce((res, [key, val]) => ({...res, [key]: {...val, date: new Date(val.date).toString()}}), {});
      console.log('Tickets', tickets);
      return {events, tickets: {byId: tickets, allIds: ticketRes.allIds}};
    },
);

/**
 * Shows some information on cartitem
 *
 * @param {T} ticketLike - based on ticket object?
 */
export const toPartialCartItem = <T extends Ticket>(ticketLike: T) => ({
  product_id: ticketLike.event_instance_id,
  price: ticketLike.ticket_price,
  desc: `${ticketLike.admission_type} - ${format(new Date(ticketLike.date), 'eee, MMM dd - h:mm a')}`,
});

const appendCartField = <T extends CartItem>(key: keyof T, val: T[typeof key]) => (obj: any) => ({...obj, [key]: val});
/**
 * Uses appendCartField to append to the cartfield
 *
 * @module
 * @param data.ticket
 * @param data.event
 * @param data.qty
 * @param {Array} data - ticket, event, qty, CartItem
 * @returns appended statements to the cartfield, appends: name, qty, product_img_url
 */
export const createCartItem = (data: {ticket: Ticket, event: Event, qty: number}): CartItem =>
  [data.ticket].map(toPartialCartItem)
      .map(appendCartField('name', `${titleCase(data.event.title)} Ticket${(data.qty>1) ? 's' : ''}`))
      .map(appendCartField('qty', data.qty))
      .map(appendCartField('product_img_url', data.event.image_url))[0];
/** @param {string} EventId */
type EventId = string

/**
 * @param {boolean} isTicket - checks if ticket object matches event_instance_id
 * @param obj
 */
const isTicket = (obj: any): obj is Ticket => Object.keys(obj).some((k) => k==='event_instance_id');

/**
 * @param {boolean} isCartItem - checks if cart object matches product_id
 * @param obj
 */
const isCartItem = (obj: any): obj is CartItem => Object.keys(obj).some((k) => k==='product_id');

/**
 * byId does checks by ID
 *
 * @param id
 */
const byId = (id: number|EventId) => (obj: Ticket|Event|CartItem) =>
    (isTicket(obj)) ?
        obj.event_instance_id===id :
        isCartItem(obj) ?
            obj.product_id===id :
            obj.id===id;

/**
 * hasConcessions checks if CartItem includes Concessions
 *
 * @param item
 */
const hasConcessions = (item: CartItem) => item.name.includes('Concessions');

/**
 * applyConcession appends and adds that it's a ticket with concessions
 *
 * @param c_price
 * @param item
 */
const applyConcession = (c_price: number, item: CartItem) => (hasConcessions(item)) ? item :
    {
      ...item,
      name: item.name + ' + Concessions',
      price: c_price + item.price,
      desc: `${item.desc} with concessions ticket`,
    };

/** ItemData array is id, qty, concessions(bool) */
interface ItemData {id: number, qty: number, concessions?: number}

/**
 * updateCartItem edits the cart items like qty, id, and concessions
 *
 * @param cart
 * @param root0
 * @param root0.id
 * @param root0.qty
 * @param root0.concessions
 */
const updateCartItem = (cart: CartItem[], {id, qty, concessions}: ItemData) =>
  cart.map((item) => (item.product_id===id) ?
        (concessions) ?
            applyConcession(concessions, {...item, qty}) :
            {...item, qty} :
        item,
  );

/**
 * addTicketReducer adds a ticketReducer to the payload and checks the id similar to qtyReducer
 *
 * @param state
 * @param action
 */
const addTicketReducer: CaseReducer<ticketingState, PayloadAction<{ id: number, qty: number, concessions: boolean }>> = (state, action) => {
  const {id, qty, concessions} = action.payload;
  const tickets = state.tickets;

  if (!tickets.allIds.includes(id)) return state;

  const ticket = tickets.byId[id];
  const inCart = state.cart.find(byId(id));
  const validRange = bound(0, ticket.availableseats);


  if (inCart) {
    return {
      ...state,
      cart: updateCartItem(state.cart, {
        id,
        qty: validRange(qty+inCart.qty),
        concessions: concessions ? ticket.concession_price : undefined,
      }),
    };
  } else {
    const event = state.events.find(byId(ticket.eventid));
    const newCartItem = event ? createCartItem({ticket, event, qty}) : null;
    return newCartItem ?
            {
              ...state,
              cart: (concessions) ?
                        [...state.cart, applyConcession(ticket.concession_price, newCartItem)] :
                        [...state.cart, newCartItem],
            } :
            state;
  }
};

/**
 * editQtyReducer changes the qty, don't update if ticket doesn't exist, and don't try to set more if available
 *
 * @param state
 * @param action
 */
// Do not update state if 1) ticket doesn't exist, 2) try to set more than available
const editQtyReducer: CaseReducer<ticketingState, PayloadAction<{id: number, qty: number}>> = (state, action) => {
  const {id, qty} = action.payload;
  if (!state.tickets.allIds.includes(id)) return state;
  const avail = state.tickets.byId[id].availableseats;
  const validRange = bound(0, state.tickets.byId[id].availableseats);

  return (qty <= avail) ?
        {...state, cart: updateCartItem(state.cart, {id, qty: validRange(qty)})} :
        state;
};

/**
 * Makes an inital state for ticketing
 *
 * @module
 * @param {Array} cart - []
 * @param {Array} tickets - byId: {}, allIds: []
 * @param {Array} events - []
 * @param {string} status - 'idle'
 */
export const INITIAL_STATE: ticketingState = {
  cart: [],
  tickets: {byId: {}, allIds: []},
  events: [],
  status: 'idle',
};

/** ticketSlice = createSlice, creates the ticketing slice */
const ticketingSlice = createSlice({
  name: 'cart',
  initialState: INITIAL_STATE,
  reducers: {
    addTicketToCart: addTicketReducer,
    editItemQty: editQtyReducer,
    removeTicketFromCart: (state, action: PayloadAction<number>) => ({
      ...state,
      cart: state.cart.filter((item) => item.product_id!==action.payload),
    }),
    removeAllTicketsFromCart: (state) => ({
      ...state,
      cart: [],
    }),
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchTicketingData.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchTicketingData.fulfilled, (state, action) => {
          state.status = 'success';
          state.tickets = (action.payload.tickets) ?
                    action.payload.tickets :
                    {byId: {}, allIds: []};
          state.events = (action.payload.events) ?
                    action.payload.events :
                    [];
        })
        .addCase(fetchTicketingData.rejected, (state) => {
          state.status = 'failed';
        });
  },
});

/**
 * export selectCartSubtotal, selectCartIds, selectCartItem, selectCartTicketCount, selectNumInCart, selectCartContents - self explanatory
 *
 * @param state
 */
export const selectCartSubtotal = (state: RootState): number => state.ticketing.cart.reduce((tot, item) => tot + (item.price * item.qty), 0);
export const selectCartIds = (state: RootState): number[] => state.ticketing.cart.map((i) => i.product_id);
export const selectCartItem = (state: RootState, id: number): CartItem|undefined => state.ticketing.cart.find((i) => i.product_id===id);
export const selectCartTicketCount = (state: RootState): {[key: number]: number} =>
  state.ticketing.cart.reduce(
      (acc, item) => {
        const key = item.product_id;
        if (key in acc) {
          return acc;
        } else {
          return {...acc, [key]: item.qty};
        }
      }
      , {},
  );
export const selectNumInCart = (state: RootState) => state.ticketing.cart.length;
export const selectCartContents = (state: RootState): CartItem[] => state.ticketing.cart;

/**
 * filterTicketsReducer - self explanatory
 *
 * @param eventid
 */
const filterTicketsReducer = (ticketsById: {[key: number]: Ticket}, eventid: EventId) =>
  (filtered: Ticket[], id: number) => {
    return (ticketsById[id].eventid===eventid) ?
            [...filtered, ticketsById[id]] :
            filtered;
  };

/**
 * Interface for EventPageData
 *
 * @module
 * @param {string} title
 * @param {string} description
 * @param {string} image_url
 * @param {Array} tickets
 */
export interface EventPageData {
    title: string,
    description: string,
    image_url: string,
    tickets: Ticket[],
}

/**
 * Name says it all
 *
 * @module
 * @param {RootState} state - different types of state of selectEventData
 * @param {EventId} eventid
 * @param ticketData - uses state.ticketing.tickets
 * @param event - uses state.ticketing.events.find(byId(eventid))
 * @returns playData, Tickets | undefined
 */
export const selectEventData = (state: RootState, eventid: EventId): EventPageData|undefined => {
  const ticketData = state.ticketing.tickets;
  const event = state.ticketing.events.find(byId(eventid));
  if (event) {
    const {...playData} = event;
    const tickets = ticketData.allIds
        .reduce(filterTicketsReducer(ticketData.byId, eventid), [] as Ticket[]);
    return {...playData, tickets};
  } else {
    return undefined;
  }
};

/**
 * Manages events page
 *
 * @module
 * @param {EventId} id
 * @param {string} eventname
 * @param {string} eventdescription
 * @param {number} numShows
 */
// Used for manage events page
interface EventSummaryData {
    id: EventId,
    eventname: string,
    eventdescription: string,
    numShows: number,
}

/**
 * Gets the data from the play when selected
 *
 * @module
 * @param {RootState} state
 * @returns {Array} id: event.id, eventname: title, eventdescription: description, numShows: filteredTickets.length
 */
export const selectPlaysData = (state: RootState) =>
  state.ticketing.events.reduce((res, event) => {
    const {id, title, description} = event;
    const filteredTickets = state.ticketing.tickets.allIds.reduce(
        filterTicketsReducer(state.ticketing.tickets.byId, id),
                [] as Ticket[],
    );

    return [
      ...res,
      {id: event.id, eventname: title, eventdescription: description, numShows: filteredTickets.length},
    ];
  },
        [] as EventSummaryData[],
  );

/**
 * Gets num of tickets available
 *
 * @module
 * @param {RootState} state
 * @param {number} ticketid
 * @returns ticket.avilableseats
 */
export const selectNumAvailable = (state: RootState, ticketid: number) => {
  const ticket = state.ticketing.tickets.byId[ticketid];
  return (ticket) ?
        ticket.availableseats :
        ticket;
};

export const {addTicketToCart, editItemQty, removeTicketFromCart, removeAllTicketsFromCart} = ticketingSlice.actions;
// @ts-ignore
export default ticketingSlice.reducer;
