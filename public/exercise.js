export class Exercise {
  constructor(name, sets, weight, date, rating=0, notes="") {
    this.name = name; // Name of the exercise  
    this.sets = sets; // Number of sets
    this.weight = weight; // Weight lifted
    
  }

  getExercise() {
    return this.name;
  }
  setExercise(name) {
    this.name = name;
  }
  getSets() {
    return this.sets;
  }
  setSets(sets) {
    this.sets = sets;
  }
  getWeight() {
    return this.weight;
  }
  setWeight(weight) {
    this.weight = weight;
  }
  
}