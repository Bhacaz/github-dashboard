<template>
  <div>
    <h1 class="title is-4 title-border-bottom">{{ title }}</h1>
    <div v-if="items" class="columns is-multiline">
      <div v-for="item in items" :key="item.id" class="column is-full pullrequest-item">
        <PullRequest :pullRequest="item" />
      </div>
    </div>
    <div v-if="!items" class="block mx-6 pb-6 pt-1">
      <progress class="progress is-small is-primary" max="100">15%</progress>
    </div>
  </div>
</template>

<script>
import PullRequest from "../components/PullRequest.vue";

export default {
  name: "PullRequestsList",
  components: {PullRequest},
  props: {
    title: {
      type: String,
      required: true
    },
    itemsToFetchParams: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      items: null
    };
  },
  methods: {
    fetchitems() {
      fetch("/api/pullrequests?itemsToFetchParams=" + this.itemsToFetchParams)
          .then((res) => res.json())
          .then((data) => {
            this.items = data;
          });
    }
  },
  mounted() {
    this.fetchitems();
  }
}
</script>

<style scoped>
  .title-border-bottom {
  border: 1px solid;
  border-image-slice: 1;
  border-width: 2px;
  border-image-source: linear-gradient(to left, #54b4bb, #7de381);
  border-left: 0;
  border-right: 0;
  border-top: 0;
  padding-bottom: 0.2em;
}

  .pullrequest-item {
    padding-bottom: 0.35rem;
    padding-top: 0.15rem;
    margin-left: 0.15rem;
  }

  .pullrequest-item:last-child {
    padding-bottom: 2.6em;
  }

  .progress.is-small {
    height: 0.35rem;
  }
</style>