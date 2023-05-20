<template>
  <section class="section">
    <div class="columns">
      <div class="prs-section section column ">
        <h1 class="title is-4 title-shadow">My Pull requests</h1>
        <div class="columns is-multiline">
          <div v-for="item in pullRequestsItems" :key="item.id" class="column is-full pullrequest-item">
            <PullRequest :pullRequest="item" />
          </div>
        </div>

        <h1 class="title is-4 title-shadow">Assignee to me</h1>
        <div class="columns is-multiline">
          <div v-for="item in assigneeToMe" :key="item.id" class="column is-full pullrequest-item">
            <PullRequest :pullRequest="item" />
          </div>
        </div>
      </div>

      <div class="prs-section section column ">
        <h1 class="title is-4 title-shadow">Review requests</h1>
        <div class="columns is-multiline">
          <div v-for="item in reviewRequestsItems" :key="item.id" class="column is-full pullrequest-item">
            <PullRequest :pullRequest="item" />
          </div>
        </div>

        <h1 class="title is-4 title-shadow">Team review requests</h1>
        <div class="columns is-multiline">
        <div v-for="item in teamreviewrequests" :key="item.id" class="column is-full pullrequest-item">
          <PullRequest :pullRequest="item" />
        </div>
        </div>
      </div>
    </div>
  </section>
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
      teamreviewrequests: [],
      assigneeToMe: []
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
    getAssigneeToMe() {
      fetch("/api/assigneetome")
          .then((res) => res.json())
          .then((data) => {
            this.assigneeToMe = data.items;
          });
    },
    getReviewRequests() {
      fetch("/api/reviewrequests")
        .then((res) => res.json())
        .then((data) => {
          this.reviewRequestsItems = data;
        });
    },
    getReviewRequestedByTeam() {
      fetch("/api/teamreviewrequests")
        .then((res) => res.json())
        .then((data) => {
          this.teamreviewrequests = data;
        });
    },
  },
  mounted() {
    this.getPullRequests();
    this.getReviewRequests();
    this.getReviewRequestedByTeam();
    this.getAssigneeToMe();
  },
}
</script>

<style scoped lang="scss">
 .pullrequest-item {
   padding-bottom: 0.35rem;
   padding-top: 0.15rem;
 }

 .pullrequest-item {
   margin-left: 0.15rem;
 }

  .pullrequest-item:last-child {
    padding-bottom: 1.75em;
  }

  .section {
    padding-top: 2rem;
  }

  .prs-section {
    //border-left: 0.05em solid #7de381;
  }

  .title-shadow {
    border: 1px solid;
    border-image-slice: 1;
    border-width: 2px;
    border-image-source: linear-gradient(to left, #54b4bb, #7de381);
    border-left: 0;
    border-right: 0;
    border-top: 0;
    padding-bottom: 0.2em;
  }
</style>
