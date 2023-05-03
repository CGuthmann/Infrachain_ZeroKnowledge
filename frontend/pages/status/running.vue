<template>
  <div>
    <div class="testimonial-component bg-extra-light">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="10" md="9" lg="7">
            <div class="text-center">
              <h2 class="section-title font-weight-medium">
                Ongoing MPC on-chain
              </h2>
              <p>
                MPC on-chain with a verifiable sequence of individual computations via ZKPs in specific cases
              </p>
            </div>
          </v-col>
        </v-row>

        <v-row class="mt-13 justify-center">

          <v-col cols="12" md="4" lg="4" class="d-flex">
            <v-card>

              <v-card-text class="text-center justify-center">
                <h2 class="mb-16">Financial MPC #1324536</h2>
                <v-progress-circular class="mb-16" :size="70" :width="7" color="error" indeterminate>
                </v-progress-circular>
                <h3>Currently ongoing MPC...</h3>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="8" lg="8" class="d-flex" style="flex-direction:column">
            <v-card>

              <v-card-text class="text-center justify-center">
                <h2 class="mb-4">Current profit from financial data</h2>
                <h4 class="mb-16">compared to sharing without MPC</h4>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-card>
                      <v-card-text>
                        <div v-if="reduction" class="pt-16 pb-16 consumption-text green">
                          - {{ valueLeft }}%
                        </div>
                        <div v-else class="pt-16 pb-16 consumption-text red">
                          + {{ valueLeft }}%
                        </div>
                        <h4 class="mb-8">last week</h4>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-card contain>
                      <v-card-text>
                        <div v-if="reduction" class="pt-16 pb-16 consumption-text green">
                          - {{ valueRight }}%
                        </div>
                        <div v-else class="pt-16 pb-16 consumption-text red">
                          + {{ valueRight }}%
                        </div>
                        <h4 class="mb-8">last month</h4>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>


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
      valueLeft: 23,
      valueRight: 37,
    }
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
