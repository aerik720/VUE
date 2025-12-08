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
            alltimes: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
            book: false,
            showtimes: false
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

        showallbookings() {
            this.book = true;
        },

        toggleShowAllBookings() {
            this.book = false;
        },

        toggletimes() {
            this.showtimes = true;
        },

        untoggletimes() {
            this.showtimes = false;
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

            <label v-if="date">Time:</label>
            <select v-if="date" v-model="time">
            <!-- https://www.w3schools.com/tags/tag_option.asp -->
                <option v-for="time in freetimes" :key="time" :value="time">{{ time }}</option>
            </select>

            <label>Service Type:</label>
            <select v-model="servicetype">
                <option v-for="type in servicetypes" :key="type" :value="type">{{ type }}</option>
            </select>
            <button type="submit">Book Service</button>
        </form>
        <div>
        <button @click="showallbookings">Show All Bookings</button>
        <button @click="toggletimes">Show Available Times</button>
        </div>
        <div v-if="book">
        <h2>All Bookings</h2>
        <button @click="sortByDate">Sort by Date</button>
        <ul>
            <li v-for="booking in allbookings" :key="booking.id">
                {{ booking.name }} - {{ booking.date }} at {{ booking.time }}
                <router-link :to="'/bookings/' + booking.id">More Info</router-link>
            </li>
        </ul>
        <button @click="toggleShowAllBookings">Hide All Bookings</button>
        </div>
        <div v-if="showtimes">
        <h2 v-if="!date">Select Date</h2>
        <h2 v-if="date">Available Times on {{ date }}</h2>
        <ul v-if="date">
            <li v-for="time in freetimes" :key="time">{{ time }}</li>
        </ul>
        <button @click="untoggletimes">Hide Available Times</button>
        </div>
    </div>
    
    `
};

const Bookingsview = {
    data() {
        return {
            alltimes: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
            isediting: false,
            servicetypes: [
                'Oil Change',
                'Tire Change',
                'Brake Service',
                'Full Service'
            ],
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
            <p v-if="bookings.comment">Comment: {{ bookings.comment }}</p>
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

            <label>Service:</label>
            <select v-model="bookings.servicetype">
                <option v-for="type in servicetypes" :key="type" :value="type">{{ type }}</option>
            </select>
            
            <input type="radio" v-model="bookings.status" value="Done">
            <label for="done">Done</label>

            <input type="radio" v-model="bookings.status" value="Upcoming">
            <label for="upcoming">Upcoming</label>

            <input type="radio" v-model="bookings.status" value="Ongoing">
            <label for="ongoing">Ongoing</label>

            <label>Comment</label>
            <input v-model="bookings.comment" type="comment">
            <button type="submit" class="btn">Save Changes</button>
        </form>
        </div>
    </div>
    </div>
    `
};

const Aboutview = {
    // https://www.youtube.com/watch?v=kjw44XKL7xI
    template: `
    <h2 class="ct">Our Services</h2>
    <details>
        <summary>
        <h1>Item 1</h1>
        </summary>
        <p>Description</p>
        <p>Description</p>
        <p>Description</p>
        <p>Description</p>
        <p>Description</p>
    </details>

    <details>
        <summary>
        <h1>Item 1</h1>
        </summary>
        <p>Description</p>
        <p>Description</p>
        <p>Description</p>
        <p>Description</p>
        <p>Description</p>
    </details>

    <details>
        <summary>
        <h1>Item 1</h1>
        </summary>
        <p>Description</p>
        <p>Description</p>
        <p>Description</p>
        <p>Description</p>
        <p>Description</p>
    </details>

    <details>
        <summary>
        <h1>Item 1</h1>
        </summary>
        <p>Description</p>
        <p>Description</p>
        <p>Description</p>
        <p>Description</p>
        <p>Description</p>
    </details>

    `
};

const Bookingview = {
    data() {
        return {
            searchtext: '',
            searching: false
        };
    },
    methods: {
        searchbooking() {
            this.searching = true;
        },

        stopsearchbooking() {
            this.searching = false;
            this.searchtext = '';
        }
    },

    computed: {
        filteredbookings() {
            if (!this.searchtext) {
                return [];
            }
            let text = this.searchtext.toLowerCase();
            let results = [];

            this.$root.bookings.forEach(booking => {
                let name = booking.name.toLowerCase();
                let regnr = booking.regnr.toLowerCase();
                let email = booking.email.toLowerCase();
                let status = booking.status.toLowerCase();

                if (name.includes(text) || regnr.includes(text) || status.includes(text) || email.includes(text)) {
                    results.push(booking);
                }
            });

            return results;
        }
    },
    template: `
    <div>
    <h2>Bookings</h2>
    <form @submit.prevent="searchbooking">
    <label>Search Booking:</label>
    <input type="text" v-model="searchtext" placeholder="Enter Regnr, Name or Email">
    <button type="submit">Search</button>
    <button type="button" @click="stopsearchbooking">Clear</button>
    <ul v-if="searching == true">
    
        <li v-for="booking in filteredbookings" :key="booking.id">
            {{ booking.name }} - {{ booking.regnr }} - {{ booking.date }} at {{ booking.time }} - {{ booking.status }}
            <router-link :to="'/bookings/' + booking.id">More Info</router-link>
            
        </li>
        
    </ul>
    </form>
    </div>
`
}
const routes = [
    { path: '/', component: Homeview },
    { path: '/services', component: Servicesview },
    { path: '/bookings', component: Bookingview },
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
