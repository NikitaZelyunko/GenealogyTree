import { MOCK_PERSONS } from './mock-person-data';

export async function getPersonById(id: number) {
  const person = MOCK_PERSONS.find((person) => person.id === id);
  if (!person) {
    throw new Error(`Person with id: ${id} not found`);
  }

  return person;
}
