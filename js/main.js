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

    mounted() {

        eventBus.$on('addColumn_1', card => {
            this.column_1.push(card)

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
            <div class="column">
                <p>В процессе</p>
                <div class="card" v-for="card in column_2">
                <h3>{{ card.name }}</h3>
                    <ul class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        <li >
                        {{ task.name }}
                        </li>
                        
                    </ul>
                </div>
            </div>
        </section>
    `,
    methods: {
        TaskCompleted(ColumnCard, task) {
            if(task.completed === false){
                task.completed = true
                ColumnCard.status += 1
            }
            let count = 0
            for(let i = 0; i < 5; i++){
                if (ColumnCard.points[i].name !== null) {
                    count++
                }
            }
            if (( ColumnCard.status / count) * 100 >= 100 ) {
                eventBus.$emit('addColumn_3', ColumnCard)
                ColumnCard.date = new Date().toLocaleString()


            }
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
            <div class="column column_three">
                <p>Завершенные задачи</p>
                <div class="card" v-for="card in column_3">
                <h3>{{ card.name }}</h3>
                    <ul class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        <li>
                        {{ task.name }}
                        </li>
                    </ul><br>
                    <p class="date">{{ card.date }}</p>
                </div>
            </div>
        </section>
    `,
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