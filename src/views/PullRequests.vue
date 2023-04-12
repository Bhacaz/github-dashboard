<template>
  <div class="section">
    <div class="columns is-multiline">
      <div v-for="item in items" :key="item.id" class="column is-full">
        <PullRequest :pullRequest="item" />
      </div>
    </div>
  </div>
</template>

<script>
import PullRequest from "../components/PullRequest.vue";

export default {
  name: "PullRequests",
  components: {PullRequest},
  data() {
    return {
      items: [],
    };
  },
  methods: {
    getPullRequests() {
      fetch("/api/pullrequests")
        .then((res) => res.json())
        .then((data) => {
          this.items = data.items;
        });
    },
  },
  mounted() {
    this.getPullRequests();
  },
}
</script>

<style scoped>
 .column {
   padding-bottom: 0.35rem;
   padding-top: 0.15rem;
 }

 .column {
   border-bottom: 1px solid #f3f3f3;
   margin-left: 0.15rem;
 }

  .column:last-child {
    border-bottom: 0;
  }

  .section {
    padding-top: 2rem;
  }

</style>
