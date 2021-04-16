<template>
<div class="wrapper">
	<div class='school'>
		<button :class="{ selected: active(school) }" v-for="school in schools" :key=school.id @click=selectSchool(school)>{{school.name}}</button>
	</div>
  <div class="spells">
    <div class="spell" v-for="spell in spells" :key="spell.id">
      <div class="info">
        <input type='text' class="spellTitle" v-model="spell.name" size='80'>
		<br/>
		<textarea class="spellDesc" v-model="spell.description" rows="4" cols="110"></textarea>
		<button v-on:click="deleteSpell(spell)">Delete Spell</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SpellList',
	data() {
		return {
			spells: [],
			schools: [],
			school: null,
			schoolName: '',
			spellDescription: '',
		}
	},
  methods: {
		async addSpell() {
			try {
				await axios.post("/api/spells", {
					name: this.spellName,
					description: this.spellDescription,
				});
				await this.getSpells();
			} catch (error) {
				console.log(error);
			}
		},
		async deleteSpell(spell) {
			try {
				await axios.delete("/api/projects/${this.school._id}/spells/${spell._id}");
				this.getSpells();
			} catch (error) {
				console.log(error);
			}
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
			const response = await axios.get("/api/schools/${this.school._id}/spells");
				this.spells = response.data;
			} catch (error) {
				console.log(error);
			}
		},
		active(school) {
			return (this.school && school._id === this.school._id);
		},
	removeSpell(spell) {
		let location = this.$root.$data.spellHistory.find((givenSpell) => givenSpell === spell);
		this.$root.$data.spellHistory.splice(location, 1);
	},
  },
	created() {
		this.getSchools();
	},
	
}
</script>

<style scoped>
.spellTitle {
	text-align: center;
	font-size: 24px;
}
.spellDesc {
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.info {
  background: #F2927D;
  color: #000;
  padding: 10px 30px;
  border: solid 2px #fff;
}

.info h1 {
  font-size: 16px;
}

.info h2 {
  font-size: 14px;
}

.info p {
  margin: 12px;
}

button {
  height: 50px;
  background: #000;
  color: white;
  border: none;
}

button.selected {
  border-top: 2px solid #000;
  border-bottom: 2px solid #000;
}

.auto {
  margin-left: auto;
}
</style>