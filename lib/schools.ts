export type School = {
  name: string
  city: string
}

export const SCHOOLS: School[] = [
  // Ljubljana
  { name: 'Gimnazija Bežigrad', city: 'Ljubljana' },
  { name: 'Škofijska klasična gimnazija', city: 'Ljubljana' },
  { name: 'Gimnazija Vič', city: 'Ljubljana' },
  { name: 'Gimnazija Šiška', city: 'Ljubljana' },
  { name: 'Srednja šola za oblikovanje in fotografijo', city: 'Ljubljana' },
  { name: 'Biotehniški izobraževalni center Ljubljana', city: 'Ljubljana' },
  { name: 'Srednja šola za gastronomijo in turizem Ljubljana', city: 'Ljubljana' },
  { name: 'Srednja zdravstvena šola Ljubljana', city: 'Ljubljana' },
  { name: 'Srednja šola za farmacijo, kozmetiko in zdravstvo', city: 'Ljubljana' },
  { name: 'Elektrotehniško-računalniška strokovna šola', city: 'Ljubljana' },
  { name: 'Ekonomska šola Ljubljana', city: 'Ljubljana' },
  { name: 'Šolski center Ljubljana', city: 'Ljubljana' },
  { name: 'Srednja strojna šola Ljubljana', city: 'Ljubljana' },
  { name: 'Srednja gradbena, geodetska in okoljevarstvena šola', city: 'Ljubljana' },
  { name: 'Srednja medijska in grafična šola', city: 'Ljubljana' },
  // Maribor
  { name: 'I. gimnazija v Mariboru', city: 'Maribor' },
  { name: 'II. gimnazija Maribor', city: 'Maribor' },
  { name: 'III. gimnazija Maribor', city: 'Maribor' },
  { name: 'Ekonomska šola Maribor', city: 'Maribor' },
  { name: 'Elektrotehniška in računalniška šola Maribor', city: 'Maribor' },
  { name: 'Srednja šola za gostinstvo in turizem Maribor', city: 'Maribor' },
  { name: 'Srednja zdravstvena in kozmetična šola Maribor', city: 'Maribor' },
  { name: 'Šolski center Maribor', city: 'Maribor' },
  // Celje
  { name: 'Gimnazija Celje – Center', city: 'Celje' },
  { name: 'Gimnazija Lava Celje', city: 'Celje' },
  { name: 'Šolski center Celje', city: 'Celje' },
  // Kranj
  { name: 'Gimnazija Kranj', city: 'Kranj' },
  { name: 'Šolski center Kranj', city: 'Kranj' },
  // Koper
  { name: 'Gimnazija Koper', city: 'Koper' },
  { name: 'Šolski center Koper', city: 'Koper' },
  // Nova Gorica
  { name: 'Gimnazija Nova Gorica', city: 'Nova Gorica' },
  { name: 'Šolski center Nova Gorica', city: 'Nova Gorica' },
  // Novo Mesto
  { name: 'Šolski center Novo Mesto', city: 'Novo Mesto' },
  { name: 'Grm Novo Mesto', city: 'Novo Mesto' },
  // Ptuj
  { name: 'Gimnazija Ptuj', city: 'Ptuj' },
  { name: 'Šolski center Ptuj', city: 'Ptuj' },
  // Murska Sobota
  { name: 'Gimnazija Murska Sobota', city: 'Murska Sobota' },
  { name: 'Šolski center Murska Sobota', city: 'Murska Sobota' },
  // Velenje
  { name: 'Šolski center Velenje', city: 'Velenje' },
  // Jesenice
  { name: 'Šolski center Jesenice', city: 'Jesenice' },
  // Trbovlje
  { name: 'Šolski center Trbovlje', city: 'Trbovlje' },
  // Slovenj Gradec
  { name: 'Šolski center Slovenj Gradec', city: 'Slovenj Gradec' },
  // Ravne na Koroškem
  { name: 'Šolski center Ravne na Koroškem', city: 'Ravne na Koroškem' },
  // Postojna
  { name: 'Šolski center Postojna', city: 'Postojna' },
  // Idrija
  { name: 'Šolski center Idrija', city: 'Idrija' },
  // Škofja Loka
  { name: 'Šolski center Škofja Loka', city: 'Škofja Loka' },
  // Domžale
  { name: 'Šolski center Domžale', city: 'Domžale' },
  // Kamnik
  { name: 'Šolski center Kamnik', city: 'Kamnik' },
  // Brežice
  { name: 'Šolski center Brežice', city: 'Brežice' },
  // Ajdovščina
  { name: 'Šolski center Ajdovščina', city: 'Ajdovščina' },
  // Tolmin
  { name: 'Šolski center Tolmin', city: 'Tolmin' },
  // Sežana
  { name: 'Šolski center Sežana', city: 'Sežana' },
  // Trebnje
  { name: 'Šolski center Trebnje', city: 'Trebnje' },
  // Radovljica
  { name: 'Šolski center Radovljica', city: 'Radovljica' },
  // Izola
  { name: 'Šolski center Izola', city: 'Izola' },
]

export const CITIES = [...new Set(SCHOOLS.map((s) => s.city))].sort()
