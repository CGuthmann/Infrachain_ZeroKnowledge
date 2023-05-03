<template>
  <div>
    <div class="banner1-component">
      <v-container>
        <!-- -----------------------------------------------
            Start Banner1
        ----------------------------------------------- -->
        <v-row justify="center">
          <v-col cols="12" md="7" lg="6" class="d-flex align-center">
            <div class="text-center text-md-left">
              <h2 class="
                  banner1-title
                  font-weight-bold
                ">
                Utilizing sensitive financial data on blockchains with zero-knowledge proofs
              </h2>
              <p class="op-8 font-weight-regular">
                By the Winners of the 2022 Infrachain Hackathon
              </p>
              <div class="mt-16 pt-2">
                <v-btn color="error" class="btn-custom-lg btn-arrow mt-10" large rounded @click="checkStatus"
                       elevation="0">
                  <span>Get Started</span>
                  <i class=" mdi mdi-arrow-right"></i>
                </v-btn>
                <v-progress-circular class="circular-loading" v-if="loadingGetStarted" indeterminate color="primary">
                </v-progress-circular>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="5" lg="5">
            <v-img :src="require('@/assets/images/banner/feet.png')" alt="banner"/>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div v-if="showSufficientTokensAvailable" class="feature1-component mini-spacer">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="10" md="9" lg="7">
            <div class="text-center">
              <h2 id="sufficientTokensAvailable" class="section-title font-weight-medium">
                Wallet Check
              </h2>
              <p>Current balance: {{ tokenAmount }} tokens</p>
            </div>
          </v-col>
        </v-row>
        <v-row justify="center" class="mt-13">
          <v-col cols="12" md="10">
            <v-card elevation="0">
              <v-card-text class="text-center justify-center">
                <div class="justify-center check-circle icon-round bg-light-info">
                  <i class="mdi mdi-check-circle"></i>
                  <!-- <i class="mdi mdi-close-circle"></i> -->
                </div>
                <h5 class="font-weight-medium font-18">Enough tokens available for participation in financial MPC</h5>
                <p class="mt-10 mb-8">
                  You need to provide one token as a deposit (no fee!) for the competition. As you already have enough
                  in your wallet, you're good to go!
                </p>
                <div>
                  <v-btn color="error" class="btn-custom-lg btn-arrow mt-10" large rounded @click="depositToken"
                         elevation="0">
                    <span>Deposit Token and start competition</span>
                    <i class=" mdi mdi-arrow-right"></i>
                  </v-btn>
                  <v-progress-circular class="circular-loading" v-if="loadingDepositToken" indeterminate
                                       color="primary">
                  </v-progress-circular>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div v-if="showInsufficientTokensAvailable" class="feature1-component mini-spacer">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="10" md="9" lg="7">
            <div class="text-center">
              <h2 id="insufficientTokensAvailable" class="section-title font-weight-medium">
                Wallet Check
              </h2>
              <p>Current balance: {{ tokenAmount }} tokens</p>
            </div>
          </v-col>
        </v-row>
        <v-row justify="center" class="mt-13">
          <v-col cols="12" md="10">
            <v-card elevation="0">
              <v-card-text class="text-center justify-center">
                <div class="justify-center close-circle icon-round bg-light-info">
                  <i class="mdi mdi-close-circle"></i>
                </div>
                <h5 class="font-weight-medium font-18">Not enough tokens available for financial MPC service </h5>
                <p class="mt-10 mb-8">
                  You need to have tokens to use the financial service. As you don't have sufficient funds you are
                  allowed to claim one initial token
                </p>
                <div>
                  <v-btn color="error" class="btn-custom-lg btn-arrow mt-10" large rounded @click="depositToken"
                         elevation="0">
                    <span>Claim Token and start competition</span>
                    <i class=" mdi mdi-arrow-right"></i>
                  </v-btn>
                  <v-progress-circular class="circular-loading" v-if="loadingDepositToken" indeterminate
                                       color="primary">
                  </v-progress-circular>
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
  name: "Banner1",
  data() {
    return {
      tokenAmount: 0,
      loadingGetStarted: false,
      loadingDepositToken: false,
      loadingRequestToken: false,
      showSufficientTokensAvailable: false,
      showInsufficientTokensAvailable: false,
    };
  },
  methods: {
    async checkStatus() {
      this.loadingGetStarted = true
      this.showSufficientTokensAvailable = false
      this.showInsufficientTokensAvailable = false
      if (await this.checkSufficientTokensAvailable()) {
        this.showSufficientTokensAvailable = true
        this.$nextTick(() => {
          this.$vuetify.goTo(
            `#sufficientTokensAvailable`
          )

        })
      } else {
        this.showInsufficientTokensAvailable = true
        this.$nextTick(() => {
          this.$vuetify.goTo(
            `#insufficientTokensAvailable`
          )

        })
      }

      this.loadingGetStarted = false
    },
    checkSufficientTokensAvailable() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(false);
        }, 1000);
      });
    },
    async depositToken() {
      this.loadingDepositToken = true
      setTimeout(() => {
        this.showSufficientTokensAvailable = true
        this.showInsufficientTokensAvailable = false
        this.tokenAmount = 1;
        this.loadingDepositToken = false
      }, 1000)
    }
  }
};
</script>
<style>
.circular-loading {
  transform: translateY(25%);
  margin-left: 10px;
}

/* .v-btn--loading .v-btn__content {
  opacity: 1;
  transform: translate3d(-0.5rem, 0, 0);
} */
</style>
