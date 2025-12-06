<template>
  <div v-if="!loading">
    <div>
      <span>ФИО:</span>
      <span>{{ personName }}</span>
    </div>
    <div>
      <span>Дата рождения:</span>
      <span>{{ personBirthDate }}</span>
    </div>
    <div>
      <span>Место рождения:</span>
      <span>{{ personBirthPlace }}</span>
    </div>
    <template v-if="isDead">
      <div>
        <span>Дата смерти:</span>
        <span>{{ personDeathDate }}</span>
      </div>
      <div>
        <span>Место смерти:</span>
        <span>{{ personDeathPlace }}</span>
      </div>
    </template>
  </div>
  <div v-else>Loading...</div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { TDateSegments, TPerson } from '../person';

const props = defineProps<{
  loading: boolean;
  personValue: TPerson | undefined;
}>();

const person = computed(() => props.personValue);

const personName = computed(() => {
  const personNameSegments = person.value?.name;
  if (!personNameSegments) {
    return '';
  }

  const { firstName, lastName, middleName } = personNameSegments;

  return `${lastName ?? 'Неизвестно'} ${firstName ?? 'Неизвестно'} ${middleName ?? 'Неизвестно'}`;
});

function getFormattedDate(dateSegments: Partial<TDateSegments>) {
  const { year, month, day } = dateSegments;

  function getFormattedNumber(value: string, pattern: string) {
    if (value.length >= pattern.length) {
      return value;
    }

    const lengthDiff = pattern.length - value.length;
    return pattern.slice(0, lengthDiff).concat(value);
  }

  const formattedYear = year
    ? getFormattedNumber(year.toString(10), '0000')
    : 'XXXX';
  const formattedMonth = month
    ? getFormattedNumber(month.toString(), '00')
    : 'XX';
  const formattedDay = day ? getFormattedNumber(day.toString(), '00') : 'XX';

  return `${formattedYear}.${formattedMonth}.${formattedDay}`;
}

const personBirthDate = computed(() => {
  const personBirthDateSegments = person.value?.birthDate;

  if (!personBirthDateSegments) {
    return '';
  }

  return getFormattedDate(personBirthDateSegments);
});

const personBirthPlace = computed(() => {
  const birthPlaceSegments = person.value?.birthPlace;
  if (!birthPlaceSegments) {
    return '';
  }

  return birthPlaceSegments.place ?? 'Неизвестно';
});

const isDead = computed(() => {
  return Boolean(person.value?.isDead);
});

const personDeathDate = computed(() => {
  const deathDateSegments = person.value?.deathDate;
  if (!deathDateSegments) {
    return isDead.value ? 'Неизвестно' : '';
  }

  return getFormattedDate(deathDateSegments);
});

const personDeathPlace = computed(() => {
  const deathPlaceSegments = person.value?.deathPlace;
  if (!deathPlaceSegments) {
    return isDead.value ? 'Неизвестно' : '';
  }

  return deathPlaceSegments.place;
});
</script>
