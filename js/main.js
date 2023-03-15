let eventBus = new Vue()

Vue.component('column', {

    template: `
 
        <div class="columns">
            <add_task></add_task>
            <div class="list">
                <column_1 :column_1="column_1"></column_1>
                <column_2 :column_2="column_2"></column_2>
                <column_3 :column_3="column_3"></column_3>
                <column_4 :column_4="column4"></column_4>
            </div>
        </div>
    `,


    data() {
        return {
            column_1: [],
            column_2: [],
            column_3: [],
            column_4: [],
        }

    },
    methods:{
        localSaveFirstColumn(){
            localStorage.setItem('column_1', JSON.stringify(this.column_1));
        },
        localSaveSecondColumn(){
            localStorage.setItem('column_2', JSON.stringify(this.column_2));
        },
        localThirdSecondColumn(){
            localStorage.setItem('column_3', JSON.stringify(this.column_3));
        },
    },

    mounted() {
        this.column_1= JSON.parse(localStorage.getItem("column_1")) || [];
        this.column_2 = JSON.parse(localStorage.getItem("column_2")) || [];
        this.column_3 = JSON.parse(localStorage.getItem("column_3")) || [];

        eventBus.$on('addColumn_1', card => {
            this.column_1.push(card)
            this.localSaveFirstColumn()

        })
        eventBus.$on('addColumn_2', card => {
            this.column_2.push(card)
            this.localSaveSecondColumn()
        })
        eventBus.$on('addColumn_3', card => {
            this.column_3.push(card)
            this.localThirdSecondColumn()
        })
    },


})

Vue.component('add_task', {
    template: `
    <div class="addForm">
        <form @submit.prevent="onSubmit">
            <div class="form__control">
                <div class="form__name field">

                    <input id="point" required v-model="name" type="text" placeholder="Название">
                </div>
            <div class="field">
                <textarea required id="point" v-model="description" placeholder="Описание"> </textarea>
            </div>
            <div class="field">
                <input required type="date" id="point" v-model="deadline">
            </div>
            <button type="submit" class="btn">Добавить</button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            name: null,
            description: null,
            date: null,
            deadline: null
            }
    },
    methods: {
        onSubmit() {
            let card = {
                name: this.name,
                description: this.description,
                date: new Date().toLocaleString(),
                deadline: this.deadline,
                reason: [],
                transfer: false,
                edit: false,
                editDate: null,
                efDate: null
            }
            eventBus.$emit('addColumn_1', card)
            this.name = null
            this.description = null
            this.date = null
            this.deadline = null
        }
    }
})


Vue.component('column_1', {
    props: {
        column_1: {
            type: Array,
        },
        column_2: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
    template: `
<section id="main" class="main-alt">
            <div class="column column__one">
            <p>Запланированные задачи</p>
                <div class="card" v-for="card in column_1">
                <br>
                   <div class="tasks">Название: {{ card.name }}</div>
                    <div class="tasks">Описание: {{ card.description }}</div>
                    <div class="tasks">Дата создания: {{ card.date }}</div>
                    <div class="tasks">Крайний срок: {{ card.deadline }}</div>
                    <div class="tasks" v-if="card.editDate != null">Последнее изменение: {{ card.editDate }}</div>                              
                    <div class="tasks" v-if="card.edit">
                    <br>
                        <form @submit.prevent="updateTask(card)">
                            <p>Новое название: 
                                <input type="text" v-model="card.name" placeholder="Название">
                            </p>
                            <p>Новое описание: 
                                <textarea v-model="card.description"></textarea>
                            </p>
                            <p>
                                <input type="submit" class="btn" value="Изменить карточку">
                            </p>
                        </form>
                    </div>
                    <a @click="deleteCard(card)" class="del">Удалить</a>  
                    <a @click="card.edit = true" class="red">Редактировать</a><br>
                    <a @click="nextColumn(card)">Следующая колонка</a>
                </div>
            </div>
        </section>
    `,

    methods: {
        nextColumn(card) {
            this.column_1.splice(this.column_1.indexOf(card), 1)
            eventBus.$emit('addColumn_2', card)
        },
        deleteCard(card) {
            this.column_1.splice(this.column_1.indexOf(card), 1)
        },
        updateTask(card){
            card.edit = false
            this.column_1.push(card)
            this.column_1.splice(this.column_1.indexOf(card), 1)
            card.editDate = new Date().toLocaleString()
        }
    }
})


Vue.component('column_2', {
    props: {
        column_2: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
    template: `
        <section id="main" class="main-alt">
            <div class="column column__two">
            <p>Задачи в работе</p>
                <div class="card" v-for="card in column_2">
                <br>
                   <div class="tasks">Название: {{ card.name }}</div>
                    <div class="tasks">Описание: {{ card.description }}</div>
                    <div class="tasks">Дата создания: {{ card.date }}</div>
                    <div class="tasks">Крайний срок: {{ card.deadline }}</div>
                    <div class="tasks" v-if="card.reason.length">Причина переноса: <p v-for="reason in card.reason">{{ reason }}</p></div>
                    <div class="tasks" v-if="card.editDate != null">Последнее изменение: {{ card.editDate }}</div>
                    <div class="tasks" v-if="card.edit">
                    <br>
                        <form @submit.prevent="updateTask(card)">
                            <p>Новое название: 
                                <input type="text" v-model="card.name" placeholder="Название">
                            </p>
                            <p>Новое описание: 
                                <textarea v-model="card.description"></textarea>
                            </p>
                            <p>
                                <input type="submit" class="btn" value="Изменить карточку">
                            </p>
                        </form>
                    </div>
                    <a @click="card.edit = true" class="red">Редактировать</a><br>
                    <a @click="nextColumn(card)">Следующая колонка</a>
                </div>
            </div>
        </section>
    `,
    methods: {
        nextColumn(card) {
            this.column_2.splice(this.column_2.indexOf(card), 1)
            eventBus.$emit('addColumn_3', card)
        },

        updateTask(card) {
            card.editDate = new Date().toLocaleString()
            card.edit = false
            this.column_2.push(card)
            this.column_2.splice(this.column_2.indexOf(card), 1)
        }
    }
})

Vue.component('column_3', {
    props: {
        column_3: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
    template: `
        <section id="main" class="main-alt">
            <div class="column column__three">
            <p>Тестирование</p>
                <div class="card" v-for="card in column_3">
                    <br>
                   <div class="tasks">Название: {{ card.name }}</div>
                    <div class="tasks">Описание: {{ card.description }}</div>
                    <div class="tasks">Дата создания: {{ card.date }}</div>
                    <div class="tasks">Крайний срок: {{ card.deadline }}</div>
                    <div class="tasks" v-if="card.reason.length">Причина переноса: <p v-for="reason in card.reason">{{ reason }}</p></div>
                    <div class="tasks" v-if="card.editDate != null">Последнее изменение: {{ card.editDate }}</div>
                    <div class="tasks" v-if="card.edit">
                        <form @submit.prevent="updateTask(card)">
                            <p style="font-size: ">Новое название: 
                                <input type="text" v-model="card.name" placeholder="Название">
                            </p>
                            <p>Новое описание: 
                                <textarea v-model="card.description"></textarea>
                            </p>
                            <p>
                                <input type="submit" class="btn" value="Изменить карточку">
                            </p>
                        </form>
                    </div>
                    <div class="tasks" v-if="card.transfer"><br>
                        <form @submit.prevent="lastColumn(card)">
                            <p>Причина переноса:
                                <input type="text" id="reasonInput">
                            </p><br>
                            <p>
                                <input class="per" type="submit" value="Перенос">
                            </p>
                        </form>
                    </div>
                    <a @click="card.edit = true" class="red">Редактировать</a> <br>
                    <a @click="card.transfer = true" class="back">Предыдущая колонка</a><br>
                    <a @click="nextColumn(card)">Следующая колонка</a>
                </div>
            </div>
        </section>
    `,
    methods: {
        lastColumn(card) {
            let reasonValue = document.getElementById('reasonInput').value;
            card.reason.push(reasonValue)
            card.transfer = false
            this.column_3.splice(this.column_3.indexOf(card), 1)
            eventBus.$emit('addColumn_2', card)
        },
        updateTask(card){
            card.editDate = new Date().toLocaleString()
            card.edit = false
            this.column_3.push(card)
            this.column_3.splice(this.column_3.indexOf(card), 1)
        },
        nextColumn(card) {
            this.column_3.splice(this.column_3.indexOf(card), 1)
            eventBus.$emit('addColumn_4', card)
        },
    }
})

Vue.component('column_4', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column__four">
            <p>Выполненные задачи</p>

            </div>
            </div>
        </section>
    `,
    props: {
        column_4: {
            type: Array,
        },
        card: {
            type: Object
        }
    },
})
let app = new Vue({
    el: '#app',
    data:{
        name: "Заметки",
    },

})