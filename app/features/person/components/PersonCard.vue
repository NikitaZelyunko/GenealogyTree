<template>
  <PersonInfo
    :loading="personDataLoadingStatus !== 'success'"
    :person-value="person"
  ></PersonInfo>
  {{ person }}
</template>

<script lang="ts" setup>
import { useAsyncData } from '#app';
import { getPersonById } from '../person-api';
import PersonInfo from './PersonInfo.vue';

const props = defineProps({
  personId: {
    type: Number,
    required: true,
  },
});

const { data: person, status: personDataLoadingStatus } = await useAsyncData(
  'person',
  () => getPersonById(props.personId),
);
</script>
