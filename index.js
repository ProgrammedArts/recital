const Tone = require('tone');

const defaultChords = [
  {
    length: '8n',
    position: 0,
    notes: ['C4', 'E4', 'G4']
  },
  {
    length: '8n',
    position: "0:2",
    notes: ['C4', 'E4', 'G4']
  },
  {
    length: '8n',
    position: "0:4",
    notes: ['C4', 'E4', 'G4']
  }
];

class Recital {
  constructor(chords = defaultChords) {
    const numVoices = this._calcNumVoices(chords);
    this.synth = new Tone.PolySynth(numVoices).toMaster();
    this.part = this._genPart(chords);
  }

  _calcNumVoices(chords) {
    return chords.reduce((prev, cur) => {
      const curNotes = cur.notes.length;
      const prevNotes = prev.notes && prev.notes.length;
      if (prevNotes > curNotes) {
        return prevNotes;
      }
      return curNotes;
    });
  }

  _genEvents(chords) {
    const events = [];
    chords.forEach(chord => {
      chord.notes.forEach(note => {
        events.push({
          time: chord.position,
          length: chord.length,
          note
        });
      });
    });
    return events;
  }

  _genPart(chords) {
    return new Tone.Part((time, value) => {
      this.synth.triggerAttackRelease(value.note, value.length, time);
    }, this._genEvents(chords));
  }

  play() {
    Tone.Transport.start();
    this.part.start(0);
  }
}

module.exports = Recital;