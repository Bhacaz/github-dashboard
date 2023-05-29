<template>
  <section class="section">
    <div class="columns">
      <div class="prs-section section column ">
        <PullRequestsList title="My Pull Requests" itemsToFetchParams="pullrequests"/>
        <PullRequestsList title="Assignee to me" itemsToFetchParams="assigneetome"/>
      </div>

      <div class="prs-section section column ">
        <PullRequestsList title="Review requests" itemsToFetchParams="reviewrequests"/>
        <PullRequestsList title="Team review requests" itemsToFetchParams="teamreviewrequests"/>
      </div>
    </div>
  </section>
</template>

<script>
import PullRequestsList from "@/components/PullRequestsList.vue";

export default {
  name: "Dashboard",
  components: {PullRequestsList},
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
    // this.getPullRequests();
    // this.getReviewRequests();
    // this.getReviewRequestedByTeam();
    // this.getAssigneeToMe();
  },
}
</script>

<style scoped lang="scss">
 .pullrequest-item {
   padding-bottom: 0.35rem;
   padding-top: 0.15rem;
   margin-left: 0.15rem;
 }

  .pullrequest-item:last-child {
    padding-bottom: 1.75em;
  }

  .section {
    padding-top: 2rem;
  }

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
</style>
