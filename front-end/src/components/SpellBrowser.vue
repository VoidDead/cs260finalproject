<template>
<div class="SpellBrowser">
  <div class='school'>
	<button :class="{ selected: active(school) }" v-for="school in schools" :key=school.id @click=selectSchool(school)>{{school.name}}</button>
  </div>
  <div class="spells" v-if="hasSpells">
    <div class="spell" v-for="spell in spells" :key="spell.id">
      <div class="info">
        <h1>{{spell.title}}</h1>
		<p>{{spell.description}}</p>
		<div class="spellMetadata"><div class="spellDate">Created: <em>{{formatDate(spell.created)}}</em></div><div class="spellCreator">{{spell.firstName}} {{spell.lastName}}</div></div>
      </div>
    </div>
  </div>
  <div v-else>
		<span v-if="isSchoolSelected"><p>This school has no spells!</p></span>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
	name: 'SpellList',
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
	computed: {
		hasSpells() {
			if (this.spells.length > 0)
			{
				return true;
			}
			else
			{
				return false;
			}
		},
		isSchoolSelected() {
			if (this.school === null)
			{
				return false;
			}
			else
			{
				return true;
			}
		},
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
				const response = await axios.get(`/api/schools/${this.school._id}/allSpells`);
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
		formatDate(date) {
			if (moment(date).diff(Date.now(), 'days') < 15)
				return moment(date).fromNow();
			else
				return moment(date).format('d MMMM YYYY');
		},
	},
}
</script>

<style scoped>
.spellDate {
	text-align: left;
	margin-left: 20px;
}
.spellCreator {
	text-align: right;
	margin-right: 20px;
}
.school {
	margin: auto;
}
.spellMetadata {
	display: flex;
	justify-content: space-between;
}
</style>