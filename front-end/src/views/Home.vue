<template>
	<div id='Home'>
  
		<div class='mainContent'>
			<h1>Special Spells</h1>
	
			<p>This is a website for mystical, magical spells. You can add spells in the 'Add Spells' page, using D&D spells or by making your own spells. You can then view the spells here.</p>
	
			<div class='school'>
				<button :class="{ selected: active(school) }" v-for="school in schools" :key=school.id @click=selectSchool(school)>{{school.name}}</button>
			</div>
			<br/>
			<div v-if="school">
				<div class="spells">
					<div class="spell" v-for="spell in spells" :key="spell.id">
						<div class="info">
							<h1>{{spell.title}}</h1>
							<p>{{spell.description}}</p>
						</div>
					</div>
				</div>
			</div>
	
		</div>
	
		<br/>
		<br/>
		<br/>
		<br/>
		<div class='footer'>
			<p><a href='https://github.com/VoidDead/creativeproject4'>https://github.com/VoidDead/creativeproject4</a></p>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';

export default 
	{
		name: 'Home',
		data() {
			return {
				spellDesc: '',
				dndSpell: '',
				schoolName: '',
				school: null,
				schools: [],
				spells: [],
				show: 'all',
			}
		},
		created() {
			this.getSchools();
		},
		methods: 
		{
			async addSchool() {
				try {
					await axios.post("/api/schools", {
						name: this.schoolName,
					});
					await this.getSchools();
				} catch (error) {
					console.log(error);
				}
			},
			async addSpell() {
				try {
					await axios.post(`/api/schools/${this.school._id}/spells`, {
						title: this.dndSpell,
						description: this.spellDesc,
					});
					this.spellDesc = "";
					this.getSpells();
				} catch (error) {
					console.log(error);
				}
			},
			async editSpell(spell) {
				this.deleteSpell(spell);
				this.dndSpell = spell.title;
				this.spellDesc = spell.description;
				this.addSpell();
			},
			async getSchools() {
				try {
					const response = await axios.get("/api/schools");
					this.schools = response.data;
				} catch (error) {
					console.log(error);
				}
			},
			selectSchool(school) {
				this.school = school;
				this.getSpells();
			},
			async getSpells() {
				try {
					const response = await axios.get(`/api/schools/${this.school._id}/spells`);
					this.spells = response.data;
				} catch (error) {
					console.log(error);
				}
			},
			async deleteSpell(spell) {
				try {
					await axios.delete(`/api/schools/${this.school._id}/spells/${spell._id}`);
					this.getSpells();
				} catch (error) {
					console.log(error);
				}
			},
			async deleteSchool(school) {
				try {
					await axios.delete(`/api/schools/${school._id}`);
					this.selectSchool(null);
					this.getSchools();
				} catch (error) {
					console.log(error);
				}
			},
			active(school) {
				return (this.school && school._id === this.school._id);
			},
			showAll() {
				this.show = 'all';
			},
			showActive() {
				this.show = 'active';
			},
			showCompleted() {
				this.show = 'completed';
			},
		},
	}

</script>

<style>
body {
	margin: 0;
	width: 100%;
}

.mainContent {
	max-width: 960px;
	margin: auto;
}

button.selected {
  border-top: 2px solid #000;
  border-bottom: 2px solid #000;
}

.spell {
	border: 2px solid #000;
	padding: 5px;
}

.footer {
	text-align: center;
	position: fixed;
	width: 100%;
	bottom:0;
	background-color: #522;
	padding-top: 15px;
	padding-bottom: 15px;
}
.footer a {
	color: #bef;
}
.footer a:hover {
	color: #1ee;
}
.footer a:active {
	color: #bfb;
}
</style>