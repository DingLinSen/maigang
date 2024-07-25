import { mapGetters } from 'vuex'
export const tipTitle = {
  computed: {
    ...mapGetters({
      tipTitle: 'getTipTitle'
    })
  }
}
