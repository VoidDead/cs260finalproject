<template>
	<div id="spells">
	<div class='mainContent'>
		<form @submit.prevent="addSchool">
			<input type="text" v-model="schoolName">
			<button type="submit">Add a School</button>
		</form>
		<br/>
		<span class='school' v-for="school in schools" :key=school.id>
			| <button :class="{ selected: active(school) }" @click=selectSchool(school)>{{school.name}}</button>
			<button :class="{ selected: active(school) }" @click=deleteSchool(school)>X</button> |
		</span>
		<br/>
		<hr/>
		<br/>
		<div v-if="school">
			<div id="input1">
				<label><strong>Enter a Spell Name: </strong></label>
				<input id="dndInput" type="text" v-model='dndSpell'><br/>
				
				<div class='orderedFloat'>
					<label><strong>Enter a Spell Description: </strong></label>
					<textarea v-model='spellDesc'></textarea><br/>
				</div>
			
				<button id="dndSubmit" v-on:click="addSpell()">Submit</button>
			</div>
			<div id="selectExplanation">
				<p>Enter the name of a D&D spell, or make up a spell.</p>
				<p>Examples: Acid Arrow, Fireball, Fire Bolt, Fly, Sanctuary</p>
			</div>
			
			<div class="spells">
				<div class="spell" v-for="spell in spells" :key="spell.id">
					<div class="info">
						<input type='text' class="spellTitle" v-model="spell.title" size='80'>
						<br/>
						<textarea class="spellDesc" v-model="spell.description" rows="4" cols="110"></textarea>
						<button v-on:click="editSpell(spell)">Edit Spell</button>
						<button v-on:click="deleteSpell(spell)">Delete Spell</button>
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
	import axios from 'axios';
	
	export default 
	{
		name: 'Spells',
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

<style scoped>

button.selected {
  border-top: 2px solid #000;
  border-bottom: 2px solid #000;
}

.orderedFloat {
	display:flex;
	justify-content: center;
	flex-wrap:wrap;
	flex-direction:row;
	align-items: center;
}

</style>
