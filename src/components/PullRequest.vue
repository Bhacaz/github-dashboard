<template>
  <div>
    <div class="time-ago">
      <span class="has-text-primary">{{ extractGitHubPullRequestInfo(pullRequest.html_url) }}</span> - <strong>{{ getTimeAgo(pullRequest.updated_at) }}</strong>
    </div>
    <h6 class="pr-title">
      <a :href="pullRequest.html_url" target="_blank">{{ pullRequest.title }}</a>
    </h6>
    <div class="span-container">
      <span class="icon-text">
        <span class="icon">
          <ion-icon name="chatbox-outline"></ion-icon>
        </span>
        <span class="comment-number">{{ pullRequest.comments }}</span>
      </span>
      <span v-for="label in pullRequest.labels" :key="label.id" class="tag-span">
      <span class="tag is-rounded" :style="{ background: '#' + label.color, color: getContrastColor(label.color) }">
        {{ label.name }}
      </span>
    </span>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'PullRequest',
  props: {
    pullRequest: {
      type: Object,
      required: true
    }
  },
  methods: {
    getContrastColor(color) {
      // Get the red, green, and blue values of the background color
      let r = parseInt(color.substr(1, 2), 16);
      let g = parseInt(color.substr(3, 2), 16);
      let b = parseInt(color.substr(5, 2), 16);

      // Calculate the luminance of the background color
      let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // If the luminance is less than 0.5, use white text; otherwise, use black text
      return luminance < 0.5 ? '#FFFFFF' : '#000000';
    },
    getTimeAgo(createdAt) {
      // Use moment.js to get the time difference between the created_at timestamp and the current time
      let diff = moment(createdAt).fromNow();

      // Return the time difference as a human-readable string
      return diff;
    },
    extractGitHubPullRequestInfo(url) {
      const regex = /^https:\/\/github.com\/([^/]+)\/([^/]+)\/pull\/(\d+)$/;
      const match = url.match(regex);

      if (!match) {
        throw new Error('Invalid GitHub pull request URL');
      }

      const [, user, repo, pullRequestNumber] = match;

      return `${user}/${repo}#${pullRequestNumber}`;
    }
  }
};
</script>

<style lang="scss" scoped>

 .tag-span {
   margin-right: 0.5rem;
   margin-bottom: 0.35rem;
 }
  .pr-title {
    padding-bottom: 0.15rem;
  }
  .tag:not(body) {
    font-size: 0.60rem;
  }
  .time-ago {
    font-size: 0.75rem;
    color: #6a737d;
    padding-top: 0.25rem;
  }
  .icon-text {
    padding-right: 0.45rem;
    font-size: 0.75rem;
  }
  .comment-number {
    padding-left: 0.15rem;
  }
  .icon {
    margin-right: -0.35em !important;
  }
  .span-container {
    display: flex;
    align-items: center; /* Center vertically */
    height: 1.3rem;
  }
</style>
