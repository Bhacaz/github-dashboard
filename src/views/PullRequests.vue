<template>
  <div class="columns">
    <div class="section column is-half">
      <div class="columns is-multiline">
        <div v-for="item in pullRequestsItems" :key="item.id" class="column is-full pullrequest-item">
          <PullRequest :pullRequest="item" />
        </div>
      </div>
    </div>

    <div class="section column is-half">
      <div class="columns is-multiline">
        <div v-for="item in reviewRequestsItems" :key="item.id" class="column is-full pullrequest-item">
          <PullRequest :pullRequest="item" />
        </div>
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
      pullRequestsItems: [],
      reviewRequestsItems: [],
    };
  },
  methods: {
    getPullRequests() {
      fetch("/api/pullrequests")
        .then((res) => res.json())
        .then((data) => {
          this.pullRequestsItems = data.items;
        });
    },
    getReviewRequests() {
      fetch("/api/reviewrequests")
        .then((res) => res.json())
        .then((data) => {
          this.reviewRequestsItems = data.items;
        });
    },
  },
  mounted() {
    this.getPullRequests();
    this.getReviewRequests();
  },
}
</script>

<style scoped>
 .pullrequest-item {
   padding-bottom: 0.35rem;
   padding-top: 0.15rem;
 }

 .pullrequest-item {
   border-bottom: 1px solid #f3f3f3;
   margin-left: 0.15rem;
 }

  .pullrequest-item:last-child {
    border-bottom: 0;
  }

  .section {
    padding-top: 2rem;
  }

</style>
