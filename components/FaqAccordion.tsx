'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'Ali je objava oglasa brezplačna?',
    a: 'Da, objava oglasa je popolnoma brezplačna. Učbenik.net ne zaračunava nobenih provizij ali pristojbin — ne pri prodajalcu, ne pri kupcu.',
  },
  {
    q: 'Kako poteka prodaja?',
    a: 'Ko objaviš oglas, te zainteresirani kupci kontaktirajo neposredno prek podatkov, ki si jih navedel (telefon ali e-mail). Dogovorita se za srečanje in predajo knjige.',
  },
  {
    q: 'Je varno kupovati prek Učbenik.net?',
    a: 'Priporočamo srečanje na javnem mestu — v šoli, knjižnici ali kavarni. Nikoli ne pošiljaj denarja vnaprej. Plačilo opravi vedno osebno ob prevzemu.',
  },
  {
    q: 'Kako izbrišem oglas, ko je knjiga prodana?',
    a: 'Prijavi se v račun in pojdi na "Moji oglasi". Pod vsakim oglasom je gumb "Izbriši oglas" — s klikom nanj se oglas takoj odstrani.',
  },
  {
    q: 'Zakaj ne morem najti željene knjige?',
    a: 'Baza oglasov je odvisna od tega, kaj dijaki objavljajo. Preverи redno ali uporabi iskanje po naslovu — novi oglasi se pojavljajo vsak dan. Lahko tudi sam objaviš povpraševanje v opisu.',
  },
]

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {FAQS.map((faq, i) => (
        <div key={i} className="bg-white border border-warm-border rounded-xl overflow-hidden">
          <button
            className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-medium text-sm hover:bg-warm-card transition-colors duration-200"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{faq.q}</span>
            <span className="text-terra text-lg shrink-0 leading-none">
              {open === i ? '−' : '+'}
            </span>
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-sm text-warm-muted leading-relaxed border-t border-warm-border pt-3">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
