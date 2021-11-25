import Vue from 'vue';
import Checkout from './Checkout.vue';
import Search from './Search.vue';
import Account from './Account.vue';
import VueMask from 'v-mask';

Vue.use(VueMask);

const checkoutEl = document.getElementById("checkout");

if (checkoutEl) {
  new Vue({
    el: checkoutEl,
    components: { Checkout }
  })
}

const searchEl = document.getElementById("search");

if (searchEl) {
  new Vue({
    el: searchEl,
    components: { Search }
  })
}

const accountEl = document.getElementById("account");

if (accountEl) {
  new Vue({
    el: accountEl,
    components: { Account }
  })
}

