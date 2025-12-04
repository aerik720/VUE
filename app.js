const Homeview = {
    template: `
    <div>
        <h1>Welcome</h1>
    </div>
    `
}

const Servicesview = {
    data() {
        return {
            id: Date.now(),
            name: '',
            email: '',
            phone: '',
            regnr: '',
            date: '',
            time: '',
            servicetype: '',
            servicetypes: [
                'Oil Change',
                'Tire Change',
                'Brake Service',
                'Full Service'
            ],
            alltimes: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]
        };
    },

    computed: {
        allbookings() {
            //https://www.w3schools.com/vue/ref_objRoot.php
            return this.$root.bookings;
        },

        bookingsfordate() {
            let results = [];

            this.allbookings.forEach(booking => {
                if (booking.date === this.date) {
                    results.push(booking);
                }
            });

            return results;
        },

        bookedtimes() {
            let times = [];

            this.bookingsfordate.forEach(booking => {
                times.push(booking.time);
            });

            return times;
        },

        freetimes() {
            let free = [];

            this.alltimes.forEach(time => {
                if (!this.bookedtimes.includes(time)) {
                    free.push(time);
                }
            });

            return free;
        },
    },
    methods: {
        bookService() {
            const newBooking = {
                id: Date.now(),
                name: this.name,
                email: this.email,
                phone: this.phone,
                regnr: this.regnr,
                date: this.date,
                time: this.time,
                servicetype: this.servicetype,
                status: "Upcoming"
            };

            this.$root.bookings.push(newBooking);
            alert(`Thank you, ${this.name}! We look forward to servicing your car.`);

            this.name = '';
            this.email = '';
            this.phone = '';
            this.regnr = '';
            this.date = '';
            this.time = '';
            this.servicetype = '';
        },

        sortByDate() {
            this.$root.bookings.sort(function (a, b) {
                
                if (a.date < b.date) return -1;
                if (a.date > b.date) return 1;

        
                if (a.time < b.time) return -1;
                if (a.time > b.time) return 1;

                return 0;
            });
        }
    },

    template: `
    <div>
        <h2>Book a Service</h2>
        <form @submit.prevent="bookService">
            <label>Name:</label>
            <input v-model="name">

            <label>Email:</label>
            <input v-model="email">

            <label>Phone:</label>
            <input v-model="phone">

            <label>Regnr:</label>
            <input v-model="regnr">

            <label>Date:</label>
            <input v-model="date" type="date">

            <label>Time:</label>
            <select v-model="time">
            <!-- https://www.w3schools.com/tags/tag_option.asp -->
                <option v-for="time in alltimes" :key="time" :value="time">{{ time }}</option>
            </select>

            <label>Service Type:</label>
            <select v-model="servicetype">
                <option v-for="type in servicetypes" :key="type" :value="type">{{ type }}</option>
            </select>
            <button type="submit">Book Service</button>
        </form>
        <div v-if="date">
            <h3>Available times for {{ date }}</h3>
            <p v-if="freetimes.length === 0">No available times for this date.</p>
            <ul v-else>
                <li v-for="time in freetimes" :key="time">{{ time }}</li>
            </ul>
        </div>
        <div>
        <h2>All Bookings</h2>
        <button @click="sortByDate">Sort by Date</button>
        <ul>
            <li v-for="booking in allbookings" :key="booking.id">
                {{ booking.name }} - {{ booking.date }} at {{ booking.time }}
                <router-link :to="'/bookings/' + booking.id">More Info</router-link>
            </li>
        </ul>
        </div>
    </div>
    `
};

const Bookingsview = {
    data() {
        return {
            alltimes: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
            isediting: false,
    };
},
    computed: {
        bookings() {
            const id = Number(this.$route.params.id);
            return this.$root.bookings.find(booking => booking.id === id);
        }
    },

    methods: {
        alterbooking() {
            this.isediting = true;
    },
        alteredbooking() {
            this.isediting = false;
            alert(`Your booking has been altered.`);
        }
},
    template: `
    <div>
    <h2>Booking info</h2>
    <div v-if="bookings" class="card">
        <div class="container">
            <h4><b>{{ bookings.name }}</b></h4> 
            <p>Email: {{ bookings.email }}</p>
            <p>Phone: {{ bookings.phone }}</p>
            <p>Regnr: {{ bookings.regnr }}</p>
            <p>Date: {{ bookings.date }}</p>
            <p>Time: {{ bookings.time }}</p>
            <p>Service Type: {{ bookings.servicetype }}</p>
            <p>Status: {{ bookings.status }}</p>
            <button @click="alterbooking">Alter Booking</button>
        </div>
        <div v-if="isediting">
        <h3>Alter Booking</h3>
        <form @submit.prevent="alteredbooking">
            <label>Email:</label>
            <input v-model="bookings.email" type="email">

            <label>Phone:</label>
            <input v-model="bookings.phone" type="tel">

            <label>Regnr:</label>
            <input v-model="bookings.regnr" type="text">

            <label>Date:</label>
            <input v-model="bookings.date" type="date">
            
            <label>Time:</label>
            <select v-model="bookings.time">
                <option v-for="time in alltimes" :key="time" :value="time">{{ time }}</option>
            </select>
            <button type="submit" class="btn">Save Changes</button>
        </form>
        </div>
    </div>
    </div>
    `
};

const Aboutview = {}

const Bookingview = {
    template: `
    <h2>Bookings</h2>

`
}
const routes = [
    { path: '/', component: Homeview },
    { path: '/services', component: Servicesview },
    {path: '/bookings', component: Bookingview },
    { path: '/bookings/:id', component: Bookingsview },
    { path: '/about', component: Aboutview },
];


const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

const app = Vue.createApp({
    data() {
        return {
            bookings: []
        }
    },
    created() {
        this.loadBookings();
    },
    methods: {
        async loadBookings() {
            try {
                const response = await fetch('bookings.json')
                if (!response.ok) {
                    throw new Error(`Kunde inte hämta bokningar`);
                }
                const data = await response.json();
                this.bookings = data.bookingdata;
            } catch (error) {
                console.error('Fel vid hämtning av bokningar:', error);
            }
        }
    }
});

app.use(router);
app.mount('#app');
