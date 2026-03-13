import {
  Stave,
  StaveNote,
  Formatter,
  Accidental,
  Barline,
  Annotation,
  Voice
} from "vexflow";

export function renderScale({ context, scaleData, options }) {
  try {
    if (!scaleData) return;

    const { key, firstMeasure, secondMeasure } = scaleData;
    const { clef, measureWidth, containerWidth, measureHeight, STAVE_SIDE_PADDING } = options;

    console.log(`Measure width: ${measureWidth}`);
    console.log(`Container width: ${containerWidth}`);

    const LYRIC_Y = 10;

    let stave1 = null;
    let stave2 = null;

    // -------------------------
    // STAVE 1
    // -------------------------
    if (firstMeasure?.notes?.length) {
      stave1 = new Stave(STAVE_SIDE_PADDING, STAVE_SIDE_PADDING, measureWidth);
      stave1.addClef(clef);
      stave1.addKeySignature(key);
      stave1.setContext(context).draw();
      if (containerWidth > 880) {
        stave1.setEndBarType(Barline.type.SINGLE);
      } else if (containerWidth <= 880) {
        stave1.setEndBarType(Barline.type.DOUBLE);
      }
      stave1.draw();
    }

    // -------------------------
    // STAVE 2
    // -------------------------
    if (secondMeasure?.notes?.length) {
      if (containerWidth > 880) {
        if (!firstMeasure?.notes?.length) {
          stave2 = new Stave(STAVE_SIDE_PADDING, STAVE_SIDE_PADDING, measureWidth);
        } else {
          stave2 = new Stave(measureWidth + STAVE_SIDE_PADDING, STAVE_SIDE_PADDING, measureWidth);
        }
      }
      else if (containerWidth <= 880) {
        if (!firstMeasure?.notes?.length) {
          stave2 = new Stave(STAVE_SIDE_PADDING, STAVE_SIDE_PADDING, measureWidth);
        }
        else {
          stave2 = new Stave(STAVE_SIDE_PADDING, STAVE_SIDE_PADDING + measureHeight, measureWidth);
        }
        stave2.addClef(clef);
        stave2.addKeySignature(key);
      } 
      stave2.setContext(context);
      stave2.setEndBarType(Barline.type.DOUBLE);
      stave2.draw();
    }

    // -------------------------
    // BUILD NOTES
    // -------------------------

    const buildNotes = (measureData, stave, ignoreKeySig = false) => {
      return measureData.notes.map((noteKey, i) => {
        const note = new StaveNote({
          keys: [noteKey],
          duration: "w",
          clef
        });

        note.setStave(stave);

        if (ignoreKeySig) note.ignoreKeySignature = true;

        // Accidentals
        const acc = measureData.accidentals?.[i];
        if (acc) {
          if (typeof acc === "string") {
            note.addModifier(new Accidental(acc), 0);
          } else if (acc.symbol) {
            const accidental = new Accidental(acc.symbol);
            if (acc.cautionary) accidental.setAsCautionary();
            note.addModifier(accidental, 0);
          }
        }

        // Lyrics
        const lyric = measureData.lyrics?.[i];
        if (lyric) {
          const ann = new Annotation(lyric)
            .setFont("Times", 12)
            .setVerticalJustification(
              Annotation.VerticalJustify.BOTTOM
            )
            .setJustification(
              Annotation.HorizontalJustify.CENTER
            );

          ann.y = stave.getYForBottomText() + LYRIC_Y;
          note.addModifier(ann, 0);
        }

        return note;
      });
    };

    const notes1VF =
      stave1 && firstMeasure?.notes?.length
        ? buildNotes(firstMeasure, stave1)
        : [];

    const notes2VF =
      stave2 && secondMeasure?.notes?.length
        ? buildNotes(secondMeasure, stave2, true)
        : [];

    const createVoice = (noteCount) =>
      new Voice({
        num_beats: noteCount * 4,
        beat_value: 4
      }).setStrict(false);

    if (notes1VF.length && stave1) {
      const voice1 = createVoice(notes1VF.length);
      voice1.addTickables(notes1VF);

      new Formatter()
        .joinVoices([voice1])
        .formatToStave([voice1], stave1);

      voice1.draw(context, stave1);
    }

    if (notes2VF.length && stave2) {
      const voice2 = createVoice(notes2VF.length);
      voice2.addTickables(notes2VF);

      new Formatter()
        .joinVoices([voice2])
        .formatToStave([voice2], stave2);

      voice2.draw(context, stave2);
    }

  } catch (e) {
    console.error("VexFlow render error:", e);
  }
}