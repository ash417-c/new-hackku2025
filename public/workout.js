import { Exercise } from './exercise.js';
export class Workouts {
  constructor(name) {
    this.name = name;
    this.workout = [];
    this.date = null; // Date of the workout
    this.rating = null; // Optional rating for the workout
    this.notes = null;
  }

  addWorkout(workout) {
    this.workout.push(workout);
  }

  getWorkout() {
    return this.workout;
  }
  getRating() {
    return this.rating;
  }
  setRating(rating) {
    this.rating = rating;
  }
  getNotes() {
    return this.notes;
  }
  setNotes(notes) {
    this.notes = notes;
  }
  getDate() {
    return this.date;
  }
  setDate(date) {
    this.date = date;
  }
}