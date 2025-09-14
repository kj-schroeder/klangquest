export class Chord {
    constructor(root, type, formula, notes, pitchedNotes, isPolyphonic = true) {
        this.root = root;
        this.type = type;
        this.formula = formula;
        this.notes = notes;
        this.pitchedNotes = pitchedNotes;
        this.isPolyphonic = isPolyphonic;
    }
}