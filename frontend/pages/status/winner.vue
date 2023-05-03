<template>
    <div>
        <div class="testimonial-component bg-extra-light">
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" sm="10" md="9" lg="7">
                        <div class="text-center">
                            <h2 class="section-title font-weight-medium">
                                Honest actor
                            </h2>
                            <p>
                                The participant of the financial MPC gains profit
                            </p>
                        </div>
                    </v-col>
                </v-row>

                <v-row class="mt-13 justify-center">

                    <v-col cols="12" md="4" lg="4" class="d-flex">
                        <v-card>
                            <v-card-text class="text-center justify-center">
                                <h2 class="mb-16">Financial MPC #1324536</h2>
                                <div>
                                    <div class="feature1-component">


                                        <div class="justify-center check-circle icon-round bg-light-info">
                                            <i class="mdi mdi-emoticon-wink"></i>
                                        </div>
                                    </div>
                                    <h3 class="mb-4">You gained profit!</h3>
                                    <h4>1 token <br /> have been transferred to your wallet</h4>
                                </div>

                            </v-card-text>
                        </v-card>
                    </v-col>

                </v-row>


            </v-container>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            chartData: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [
                    {
                        label: 'Last Week',
                        borderColor: '#5C1A81',
                        backgroundColor: '#5C1A81',

                        tension: 0.25,
                        data: [3, 4, 6, 10, 5, 6]
                    },
                    {
                        label: 'Current Week',
                        borderColor: '#316ce8',
                        backgroundColor: '#316ce8',

                        tension: 0.25,
                        data: [1, 2, 3, 4, 5, 6]
                    }
                ]
            },
        }
    },
    methods: {

    },
    mounted() {
        setInterval(() => {
            this.update()
        }, 15 * 1000) // every 15s
    },


}
</script>
<style>
.consumption-text {
    font-size: 70px !important;
}

.red {
    color: #B71C1C;
}

.green {
    color: green;
}
</style>
