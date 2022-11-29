<template>
    <div>
        <div class="testimonial-component bg-extra-light">
            <v-container>
                <!-- -----------------------------------------------
            Start Testimonial Text
        ----------------------------------------------- -->
                <v-row justify="center">
                    <v-col cols="12" sm="10" md="9" lg="7">
                        <div class="text-center">
                            <h2 class="section-title font-weight-medium">
                                Check your current energy consumption
                            </h2>
                            <p>
                                You can see realtime data of your smart meter running in your building
                                <!-- You can relay on our amazing features list and also our customer
                                services will be great experience for you without doubt and in
                                no-time -->
                            </p>
                        </div>
                    </v-col>
                </v-row>

                <v-row class="mt-13" justify="center">




                    <v-col cols="12" md="10" lg="8">
                        <v-card>
                            <v-card-text>
                                <line-chart width="100%" :height="50" ref="line" chart-id='myCustomId'
                                    :chart-options="chartOptions" :chart-data="chartData" />
                            </v-card-text>
                        </v-card>
                    </v-col>

                </v-row>
            </v-container>
        </div>

        <!-- <v-btn @click="update">Update</v-btn> -->


    </div>
</template>
<script>
export default {
    data() {
        return {
            gradient: null,
            labels: [],
            data: [],
            counter: 7,
            chartData: {
                labels: ['15:02:10', '15:02:15', '15:02:20', '15:02:28', '15:02:30', '15:02:35'],
                datasets: [
                    {
                        label: 'Energy Consumption',
                        borderColor: '#316ce8',
                        backgroundColor: '#316ce8',

                        tension: 0.25,
                        data: [1, 2, 3, 4, 5, 6]
                    }
                ]
            },
            options: {
                responsive: true,

            }
        }
    },

    methods: {
        update() {
            const currentDate = new Date().toLocaleTimeString('en-GB', {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            });

            //this.chartData.labels.push(currentDate)
            const labels = this.chartData.labels
            const data = this.chartData.datasets[0].data

            if (labels.length === 10) {
                labels.shift()
                data.shift()
            }

            labels.push(currentDate)
            data.push(this.counter++)

            // this.chartData.labels = this.sliceLabels(currentDate)
            // this.chartData.datasets[0].data = this.sliceData(this.counter++)

        },
    },
    mounted() {
        setInterval(() => {
            this.update()
        }, 15 * 1000) // every 15s
    },


}
</script>
<style>
.Chart {
    background: #212733;
    /* border-radius: 15px;
    box-shadow: 0px 2px 15px rgba(25, 25, 25, 0.27);
    margin: 25px 0; */
}

.Chart h2 {
    /* margin-top: 0;
    padding: 15px 0;
    color: rgba(255, 0, 0, 0.5); */
    border-bottom: 1px solid #323d54;
}
</style>