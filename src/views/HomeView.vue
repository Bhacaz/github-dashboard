<template>
  <div class="hero is-fullheight">
    <div class="container is-flex is-align-items-center is-justify-content-center">
      <div>
        <h1 class="title is-3 has-text-centered">
          <RouterLink to="/dashboard">GitHub PullRequests<br>Dashboard</RouterLink>
        </h1>
        <div class="is-fullwidth has-text-centered">
          <a id="login-button" @click="initiateOAuthFlow()" class="button is-primary mx-auto">
            <span>Login with GitHub</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
const githubRedirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI;

 export default {
   name: "HomeView",
   methods: {
     initiateOAuthFlow() {
       window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${githubRedirectUri}&scope=repo`;
     },
   }
 }
</script>

<style scoped lang="scss">
  #login-button:hover {
   background: linear-gradient(120deg, #54b4bb, #7de381);
  }
</style>
