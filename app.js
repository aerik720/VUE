// Vy för startsidan
const Homeview = {
    // Html template för hemsidan
    template: `
    <div>
        
        <div class="homeContainer">
        <img class="img" src="https://images.pexels.com/photos/12185933/pexels-photo-12185933.jpeg" alt="Car Service">
        <p class="welcometext">Welcome to Limton's Auto! </p>
        <p class="welcometext2">Whether you need an oil change, tire rotation, or a full service, we've got you covered. Use the Buttons below or the links above to get started!</p>
        </div>

        <div class="btnCard">
        <!-- Knapp i router link för att ta sig till bokningssidan -->
        <router-link to="/services">
            <button class="btnHome">Book a Service</button>
        </router-link>
        <router-link to="/bookings">
            <button class="btnHome">View Bookings</button>
        </router-link>
        </div>
    </div>
    `
}

// Vy för bokningssidan
const Servicesview = {
    // här är all data vi behöver för att boka en service
    data() {
        return {
            // ID fick vi hjälp av chatgpt hur vi skulle göra
            id: Date.now(),
            name: '',
            email: '',
            phone: '',
            regnr: '',
            date: '',
            time: '',
            servicetype: '',
            // olika servicetyper
            servicetypes: [
                'Oil Change',
                'Tire Change',
                'Brake Service',
                'Full Service'
            ],
            extraservice: '',
            extraservices: [
                'Car Wash',
                'Interior Cleaning',
                'New Tires',
            ],
            // möjliga tider
            alltimes: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
            // sätter book och showtimes till false direkt så att alla bokningar och lediga tider inte visas från start
            book: false,
            showtimes: false,
            
        };
    },
    // här är alla beräknade värden vi behöver för att hantera bokningar och tider
    computed: {
        // hämtar alla bokningar från root
        allbookings() {
            //https://www.w3schools.com/vue/ref_objRoot.php
            return this.$root.bookings;
        },
        // filtrerar bokningar för valt datum
        bookingsfordate() {
            let results = [];
            // går igenom alla bokningar och kollar om datumet matchar valt datum
            this.allbookings.forEach(booking => {
                if (booking.date === this.date) {
                    // om det matchar, lägg till i results listan
                    results.push(booking);
                }
            });

            return results;
        },
        // hämtar alla bokade tider
        bookedtimes() {
            let times = [];

            this.bookingsfordate.forEach(booking => {
                times.push(booking.time);
            });

            return times;
        },
        // räknar ut lediga tider
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
    // här är alla metoder vi behöver för att hantera bokningar och visningar
    methods: {
        // metod för att boka en ny service
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
                extraservice: this.extraservice,
                status: "Upcoming"
            };
            // lägger till den nya bokningen i root's bookings array och meddelar användaren
            this.$root.bookings.push(newBooking);
            alert(`Thank you, ${this.name}! We look forward to servicing your car.`);
            // tömmer fälten efter gjord bokning
            this.name = '';
            this.email = '';
            this.phone = '';
            this.regnr = '';
            this.date = '';
            this.time = '';
            this.servicetype = '';
            this.extraservice = '';
        },
        // när man trycker på knappen så blir book true och alla bokningar visas
        showallbookings() {
            this.book = true;
        },
        // knappen för att dölja alla bokningar
        toggleShowAllBookings() {
            this.book = false;
        },
        // knappen för att visa lediga tider
        toggletimes() {
            this.showtimes = true;
        },
        // knappen för att dölja lediga tider
        untoggletimes() {
            this.showtimes = false;
        },
        // sorterar bokningar efter datum och tid i stigande ordning
        sortByDate() {
            // frågade chatgpt om hjälp med sortering av datum och tid
            this.$root.bookings.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateA - dateB;
            });
           
        },
        // sorterar bokningar efter datum och tid i fallande ordning
        sortByDateReverse() {
            // frågade chatgpt om hjälp med sortering av datum och tid
            this.$root.bookings.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateB - dateA;
            });
            
        }
    },

    template: `
    <div>
        <div>
        <h2 class="title serviceText">Book a Service</h2>
        <img class="img2" src="https://images.pexels.com/photos/12185933/pexels-photo-12185933.jpeg" alt="Car Service">
        </div>
        <!-- Formulär för att göra bokning, @submit.prevent för att inte skicka datan förens man tryckt på submit -->
        <form class="form" @submit.prevent="bookService">
            <label>Please Enter Name:</label>
            <input placeholder="Example Examplesson" v-model="name">

            <label>Please Enter Email:</label>
            <input placeholder="Example@Examplemail.com" v-model="email">

            <label>Please Enter Phonenumber:</label>
            <input placeholder="Example: 0701234567" v-model="phone">

            <label>Please Enter Registrationnumber:</label>
            <input placeholder="Example: EXX123" v-model="regnr">

            <label>Please Select Date:</label>
            <input  v-model="date" type="date">

            <!-- V-if gör så att om ett datum är valt så visas lediga tider på det datumet -->
            <label v-if="date">Time:</label>
            <select v-if="date" v-model="time">
            <!-- https://www.w3schools.com/tags/tag_option.asp -->
                        
                <option v-for="time in freetimes" :key="time" :value="time">{{ time }}</option>
            </select>

            <label>Please Select Service Type:</label>
            <select v-model="servicetype">
                <!-- Tog hjälp av Chatgpt för att lägga till placeholder i option element-->
                <option value="" disabled selected hidden>Please select Service</option>
                <option v-for="type in servicetypes" :key="type" :value="type">{{ type }}</option>
            </select>

            <label>Please Select Extra service:</label>
            <select v-model="extraservice" >
                <option value="" disabled selected hidden>Optional</option>
                <option v-for="extra in extraservices" :key="extra" :value="extra">{{ extra }}</option>
            </select>

            <!-- knapp med submit för att skicka datan -->
            <button type="submit">Book Service</button>
        </form>

        <!-- sektion för att visa alla bokningar och lediga tider -->
        <div class="btnCard2">
        <!-- knappar som sätter book och freetimes till true -->
        <button class="btnBook" @click="showallbookings">Show All Bookings</button>
        <button class="btnBook" @click="toggletimes">Show Available Times</button>
        </div>
        <div class="containerBook"v-if="book">
        <h2 class="title">All Bookings</h2>
        <!-- knappar som sorterar datum i fallande eller stigande ordning -->
        <button class="btnBook" @click="sortByDate">Sort by Date</button>
        <button class="btnBook" @click="sortByDateReverse">Reversed Date</button>
        <ul class="ul">
            <li v-for="booking in allbookings" :key="booking.id">
                {{ booking.name }} - {{ booking.date }} at {{ booking.time }}
                 <!-- more info länk som skickar med bokningsid till nästa sida -->
                <router-link class="routerlink" :to="'/bookings/' + booking.id">More Info</router-link>
            </li>
        </ul>
        <button class="btnBook" @click="toggleShowAllBookings">Hide All Bookings</button>
        </div>
        <!-- V-if gör så att detta visas endast om showtimes är true -->
        <div class="containerBook" v-if="showtimes">
        <h2 class="warningtext" v-if="!date">Please Select Date</h2>
        <h2 class="title" v-if="date">Available Times on {{ date }}</h2>
        <ul class="ul" v-if="date">
            <li v-for="time in freetimes" :key="time">{{ time }}</li>
        </ul>
        <button class="btnBook" @click="untoggletimes">Hide Available Times</button>
        </div>
    </div>
    
    `
};

// Vy för enskild bokning
const Bookingsview = {
    // all data vi behöver för att visa och ändra en bokning
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
            extraservices: [
                'Car Wash',
                'Interior Cleaning',
                'New Tires',
            ],
        };
    },
    // beräknade värden
    computed: {
        // hämtar bokningen baserat på id från routen
        bookings() {
            // https://router.vuejs.org/guide/essentials/dynamic-matching.html
            const id = Number(this.$route.params.id);
            return this.$root.bookings.find(booking => booking.id === id);
        }
    },
    // metoder för att ändra och ta bort bokningar
    methods: {
        // sätter isediting till true för att visa form så man kan ändra
        alterbooking() {
            this.isediting = true;
        },
        // sparar ändringarna och sätter isediting till false
        alteredbooking() {
            this.isediting = false;
            alert(`Your booking has been altered.`);
        },
        // tar bort bokningen från root's bookings array
        deletebooking() {
            const index = this.$root.bookings.findIndex(booking => booking.id === this.bookings.id);
            this.$root.bookings.splice(index, 1);
            alert(`Booking deleted.`);
            // efter borttagning, navigera tillbaka till services sidan med hjälp av .push
            this.$router.push('/Services');

        }
    },
    
    template: `
    <div>
    <div>
    <h2 class="serviceText">Booking info</h2>
    <img class="img2" src="https://images.pexels.com/photos/12185933/pexels-photo-12185933.jpeg" alt="Car Service">
    </div>
    <!-- Om bokning finns visa den -->
    <div v-if="bookings" class="container">
        <div class="card">
        <!-- <b> för att få css styling -->
            <h4><b>{{ bookings.name }}</b></h4> 
            <p><b>Email:</b> {{ bookings.email }}</p>
            <p><b>Phone:</b> {{ bookings.phone }}</p>
            <p><b>Regnr:</b> {{ bookings.regnr }}</p>
            <p><b>Date:</b> {{ bookings.date }}</p>
            <p><b>Time:</b> {{ bookings.time }}</p>
            <p><b>Service Type:</b> {{ bookings.servicetype }}</p>
            <!-- Om extraservice eller kommentar finns visa den -->
            <p v-if="bookings.extraservice"><b>Extra:</b> {{ bookings.extraservice }}</p>
            <p><b>Status:</b> {{ bookings.status }}</p>
            <p v-if="bookings.comment"><b>Comment:</b> {{ bookings.comment }}</p>
            <button class="btnBook" @click="alterbooking">Alter Booking</button>
        </div>
        <!-- Om isediting är true visa alterbooking formuläret -->
        <div v-if="isediting">
        <h3 class="title" >Alter Booking</h3>
        <form class="form" @submit.prevent="alteredbooking">
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
            
            <label>Extra service:</label>
            <select v-model="bookings.extraservice">
                <option  v-for="extra in extraservices" :key="extra" :value="extra">{{ extra }}</option>
            </select>
            
            <!-- Radioknappar så att man kan ändra statusen på bokningen -->
            <label for="done">Done</label>
            <input type="radio" v-model="bookings.status" value="Done">
            
            <label for="upcoming">Upcoming</label>
            <input type="radio" v-model="bookings.status" value="Upcoming">
            
            <label for="ongoing">Ongoing</label>
            <input type="radio" v-model="bookings.status" value="Ongoing">
            
            <label>Comment:</label>
            <input v-model="bookings.comment" type="comment">
            
            <div class="btnCard2">
            <button class="btnBook" type="submit" class="btn">Save Changes</button>
            <!-- Knapp för att ta bort en bokning -->
            <button class="btnBook" type="button" @click="deletebooking">Delete booking</button>
            </div>
        </form>
        </div>
    </div>
    </div>
    `
};

// Vy för om oss sidan
const Aboutview = {
    // https://www.youtube.com/watch?v=kjw44XKL7xI
    template: `
    <div>
    <h2 class="serviceText">Our Services</h2>
    <img class="img2" src="https://images.pexels.com/photos/12185933/pexels-photo-12185933.jpeg" alt="Car Service">
    </div>
    <div class="container containerBook">
    <!-- Html för att bygga upp en accordion -->
    <details>
    <!-- Titel och beskrivning av varje service -->
        <summary>
        <h1>Oil Change</h1>
        </summary>
        <p>We drain old engine oil, replace the oil filter, and refill with fresh oil to keep your engine running smoothly and efficiently.</p>
        
    </details>

    <details>
        <summary>
        <h1>Tire Change</h1>
        </summary>
        <p>We change your tires for you so you don't have to.</p>
    
    </details>

    <details>
        <summary>
        <h1>Brake Service</h1>
        </summary>
        <p>We inspect brake pads, rotors, and components, then repair or replace parts as needed to restore safe, responsive braking.</p>
        
    </details>

    <details>
        <summary>
        <h1>Full Service</h1>
        </summary>
        <p>A complete vehicle checkup including fluid top-ups, filter replacements, tire inspection, and overall system evaluation to ensure peak performance and reliability.</p>
        
    </details>

    <details>
        <summary>
        <h1>Car Wash</h1>
        </summary>
        <p>Exterior wash, rinse, and dry to remove dirt and grime, leaving your vehicle looking clean and polished.</p>
        
    </details>

    <details>
        <summary>
        <h1>Interior Cleaning</h1>
        </summary>
        <p>Thorough vacuuming, wipe-down, and detailing of all interior surfaces to leave your car fresh, clean, and comfortable.</p>
        
    </details>

    <details>
        <summary>
        <h1>New Tires</h1>
        </summary>
        <p>We can offer you brand new tires and install them for you.</p>
        
    </details>
    </div>

    `
};

// Vy för att kunna söka bland alla befintliga bokningar
const Bookingview = {
    // Data för att kunna söka
    data() {
        return {
            // Gör textfältet tomt från början
            searchtext: '',
            // Sätt searching till false från start
            searching: false
        };
    },
    // Metoder för sökfunktion
    methods: {
        // Searching sätts till true när man trycker search
        searchbooking() {
            this.searching = true;
        },

        // Funktion för clear knappen, sätter searching till false och tömmer sökfältet
        stopsearchbooking() {
            this.searching = false;
            this.searchtext = '';
        }
    },
    // Beräkningar för att kunna söka på olika nyckelord i bokningarna
    computed: {
        filteredbookings() {
            // Om ingen text anges skicka tillbaka en tom lista
            if (!this.searchtext) {
                return [];
            }
            // Gör inputtexten till små bokstäver
            let text = this.searchtext.toLowerCase();
            // Ny array för resultat
            let results = [];

            // Gör om alla namn, regnr, email, och status till små bokstäver i alla bokningar
            this.$root.bookings.forEach(booking => {
                let name = booking.name.toLowerCase();
                let regnr = booking.regnr.toLowerCase();
                let email = booking.email.toLowerCase();
                let status = booking.status.toLowerCase();

                // Jämför om användarinputen finns i någon av bokninarnas namn, regnr, email, eller status 
                if (name.includes(text) || regnr.includes(text) || status.includes(text) || email.includes(text)) {
                    // Lägg till alla matchningar i results
                    results.push(booking);
                }
            });

            // Skicka tillbaka resultatet
            return results;
        }
    },
    template: `
    <div>
    <div>
    <h2 class="serviceText">Bookings</h2>
    <img class="img2" src="https://images.pexels.com/photos/12185933/pexels-photo-12185933.jpeg" alt="Car Service">
    </div>
    <form class="form" @submit.prevent="searchbooking">
    <label>Search Booking:</label>
    <input type="text" v-model="searchtext" placeholder="Enter Regnr, Name or Email">
    <button type="submit">Search</button>
    <button type="button" @click="stopsearchbooking">Clear</button>
    <!-- Om searching är true, visa bokningarna som matchar sökningen -->
    <ul class="ul" v-if="searching == true">
    
        <li v-for="booking in filteredbookings" :key="booking.id">
            {{ booking.name }} - {{ booking.regnr }} - {{ booking.date }} at {{ booking.time }} - {{ booking.status }}
            <router-link class="routerlink" :to="'/bookings/' + booking.id">More Info</router-link>
            
        </li>
        
    </ul>
    </form>
    </div>
`
}
// Här är alla routes för hemsidan som kopplar ihop path med komponent
const routes = [
    { path: '/', component: Homeview },
    { path: '/services', component: Servicesview },
    { path: '/bookings', component: Bookingview },
    { path: '/bookings/:id', component: Bookingsview },
    { path: '/about', component: Aboutview },
];

// Skapa routern
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

// Skapar Vue appen
const app = Vue.createApp({
    // Data som ligger i root
    data() {
        return {
            // Våran array som innehåller alla bokningar 
            bookings: []
        }
    },
    // När appen skapas, körs funktionen som laddar in alla bokningar från JSON filen
    created() {
        this.loadBookings();
    },
    methods: {
        // Fetchar JSON data
        async loadBookings() {
            try {
                const response = await fetch('bookings.json')
                // Om fetchen inte lyckas skapa ett error
                if (!response.ok) {
                    throw new Error(`Kunde inte hämta bokningar`);
                }
                //Hämta JSON data och lägg in det i arrayen
                const data = await response.json();
                this.bookings = data.bookingdata;
                // Fångar upp fel och meddelar i konsolen
            } catch (error) {
                console.error('Fel vid hämtning av bokningar:', error);
            }
        }
    }
});

// Appen använder routern och "mountas" in i base.html filen
app.use(router);
app.mount('#app');
