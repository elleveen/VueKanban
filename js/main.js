let eventBus = new Vue()

Vue.component('column', {

    template: `
 
        <div class="columns">
            <add_task></add_task>
            <div class="list">
                <column_1 :column_1="column_1"></column_1>
                <column_2 :column_2="column_2"></column_2>
                <column_3 :column_3="column_3"></column_3>
            </div>
        </div>
    `,


    data() {
        return {
            column_1: [],
            column_2: [],
            column_3: [],
        }

    },

    methods:{
        localSaveFirstColumn(){
            localStorage.setItem('column_1', JSON.stringify(this.column_1));
        },
        localSaveSecondColumn(){
            localStorage.setItem('column_2', JSON.stringify(this.column_2));
        },
        localSaveThirdColumn(){
            localStorage.setItem('column_3', JSON.stringify(this.column_3));
        },
    },

    mounted() {

        this.column_1= JSON.parse(localStorage.getItem("column_1")) || [];
        this.column_2 = JSON.parse(localStorage.getItem("column_2")) || [];
        this.column_3 = JSON.parse(localStorage.getItem("column_3")) || [];

        eventBus.$on('addColumn_1', ColumnCard => {

            if (this.column_1.length < 3) {
                this.column_1.push(ColumnCard)
                this.localSaveFirstColumn()
            } else {
                alert('Максимальное колчиство карточек - три')

            }
        })
        eventBus.$on('addColumn_2', ColumnCard => {
            if (this.column_2.length < 5) {
                this.column_2.push(ColumnCard)
                this.column_1.splice(this.column_1.indexOf(ColumnCard), 1)
                this.localSaveSecondColumn();
            } else {
                alert('Максимальное колчиство карточек - пять')

            }


        })
        eventBus.$on('addColumn_3', ColumnCard => {
            this.column_3.push(ColumnCard)
            this.column_2.splice(this.column_2.indexOf(ColumnCard), 1)
            this.localSaveThirdColumn();

        })



    },

    watch: {
        column_1(newValue) {
            localStorage.setItem("column_1", JSON.stringify(newValue));
        },
        column_2(newValue) {
            localStorage.setItem("column_2", JSON.stringify(newValue));
        },
        column_3(newValue) {
            localStorage.setItem("column_3", JSON.stringify(newValue));
        }
    },

})

Vue.component('add_task', {
    template: `
    <section id="main" class="main">
    
        <form class="row" @submit.prevent="Submit">
        <div class="form_control">
            <div class="form_name">
                <input required type="text" v-model="name" id="name" placeholder="Введите название заметки"/>
            </div>
            
            <input required type="text"  v-model="point_1" placeholder="Первый пункт"/>
            <br>
            <input required type="text"  v-model="point_2" placeholder="Второй пункт"/>
            <br>
            <input required type="text"  v-model="point_3" placeholder="Третий пункт"/> 
            <br>
            <input  type="text"  v-model="point_4"  placeholder="Четвертый пункт"/>
            <br>
             <input type="text" v-model="point_5"  placeholder="Пятый пункт"/>
        </div>
            <div class="form_control">
                <button>Отправить</button>
            </div>
        </form>
    </section>
    `,
    data() {
        return {
            name: null,
            point_1: null,
            point_2: null,
            point_3: null,
            point_4: null,
            point_5: null,
            date: null,
        }
    },
    methods: {
        Submit() {
            let card = {
                name: this.name,
                points: [
                    {name: this.point_1, completed: false},
                    {name: this.point_2, completed: false},
                    {name: this.point_3, completed: false},
                    {name: this.point_4, completed: false},
                    {name: this.point_5, completed: false}
                ],
                date: null,
                status: 0,
            }
            eventBus.$emit('addColumn_1', card)
            this.name = null;
            this.point_1 = null
            this.point_2 = null
            this.point_3 = null
            this.point_4 = null
            this.point_5 = null
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
            <div class="column">
            <p>Задачи</p>
            <div class="card" v-for="card in column_1">
                <h3>{{ card.name }}</h3>
                    <ul class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        <li>
                        {{ task.name }}
                        </li>
                    </ul>
                    
            </div> 
            </div>
        </section>
    `,

    methods: {
        TaskCompleted(ColumnCard, task) {
            if (task.completed === false){
                task.completed = true
                ColumnCard.status += 1
            }
            let count = 0
            for (let i = 0; i < 5; ++i) {
                if (ColumnCard.points[i].name !== null) {
                    count++;
                }
            }
            if ((ColumnCard.status / count) * 100 >= 50) {
                eventBus.$emit('addColumn_2', ColumnCard)
                this.column_1.splice(this.column_1.indexOf(ColumnCard), 0)
            }
        },

    },
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

let app = new Vue({
    el: '#app',
    data:{
        name: "Заметки",
    },

})