<template>
  <div id="app">
    <div id="nav">
		<router-link to="/">Home</router-link> |
		<router-link to="/spells">Add Spells</router-link> |
		<router-link to="/login">Login/Register</router-link>
		<div v-if="user">
			<p><span class='userName'>{{user.firstName}} {{user.lastName}} <button @click="logout">Logout</button></span></p>
		</div>
		<hr/>
    </div>
	
    <router-view/>
	
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<div class='footer'>
		<p><a href='https://github.com/VoidDead/cs260finalproject'>https://github.com/VoidDead/cs260finalproject, Work Time: 10 Hours</a></p>
	</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
	computed: {
		user() {
			return this.$root.$data.user;
		},
	},
	methods: {
		async logout() {
			try {
				await axios.delete("/api/users");
				this.$root.$data.user = null;
			} catch (error) {
				this.$root.$data.user = null;
			}
		},
	},
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.userName {
	border: solid 2px #000;
	padding: 5px;
}
</style>
