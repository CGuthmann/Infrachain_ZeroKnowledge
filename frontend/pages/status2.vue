<template>
    <div>
        <div class="testimonial-component bg-extra-light">
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" sm="10" md="9" lg="7">
                        <div class="text-center">
                            <h2 class="section-title font-weight-medium">
                                Competition status
                            </h2>
                            <p>
                                Observe the realtime status of the current competition
                            </p>
                        </div>
                    </v-col>
                </v-row>

                <v-row v-if="running" class="mt-13 justify-center">

                    <v-col cols="12" md="4" lg="4" class="d-flex">
                        <v-card>

                            <v-card-text class="text-center justify-center">
                                <h2 class="mb-16">Competition #1324536</h2>
                                <v-progress-circular class="mb-16" :size="70" :width="7" color="error" indeterminate>
                                </v-progress-circular>
                                <h3>Currently running...</h3>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="8" lg="8" class="d-flex" style="flex-direction:column">
                        <v-card>

                            <v-card-text class="text-center justify-center">
                                <h2 class="mb-4">Current energy consumption</h2>
                                <h4 class="mb-16">compared to last week</h4>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-card>
                                            <v-card-text>
                                                <div v-if="reduction" class="pt-16 pb-16 consumption-text green">
                                                    - {{ differenceConsumption }}%
                                                </div>
                                                <div v-else class="pt-16 pb-16 consumption-text red">
                                                    + {{ differenceConsumption }}%
                                                </div>
                                                <h4 class="mb-8">your consumption</h4>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-card contain>
                                            <v-card-text>
                                                <div v-if="reduction" class="pt-16 pb-16 consumption-text green">
                                                    - {{ differenceConsumption }}%
                                                </div>
                                                <div v-else class="pt-16 pb-16 consumption-text red">
                                                    + {{ differenceConsumption }}%
                                                </div>
                                                <h4 class="mb-8">others in your region</h4>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>



                            </v-card-text>
                        </v-card>
                    </v-col>

                </v-row>

                <v-row v-if="won" class="mt-13 justify-center">

                    <v-col cols="12" md="4" lg="4" class="d-flex">
                        <v-card>

                            <v-card-text class="text-center justify-center">
                                <h2 class="mb-16">Competition #1324536</h2>
                                <div class="feature1-component">


                                    <div class="justify-center check-circle icon-round bg-light-info">
                                        <i class="mdi mdi-check-circle"></i>
                                        <!-- <i class="mdi mdi-close-circle"></i> -->
                                    </div>
                                </div>
                                <h3 class="mb-4">You won!</h3>
                                <h4>XXX ETH <br /> have been transferred to your wallet</h4>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="8" lg="8" class="d-flex" style="flex-direction:column">
                        <v-card>

                            <v-card-text class="text-center justify-center">
                                <h2 class="mb-4">Energy consumption</h2>
                                <h4 class="mb-4">per day compared to last week</h4>
                                <line-chart width="100%" :height="40" ref="line" chart-id='myCustomId'
                                    :chart-options="chartOptions" :chart-data="chartData" />



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
            running: false,
            won: true,
            reduction: true,
            differenceConsumption: 20,
            consumptionColor: 'grey',
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
