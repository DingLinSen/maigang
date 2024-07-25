import CountUp from 'countup'
import { isNumber } from '@/libs/util'
export const countUp = {
  methods: {
    countUpNumber(id, val) {
      if(isNumber(val)) {
        val = Number(val)
        setTimeout(() => {
          let valArray = val.toString().split(".")
          let circleNumber = 0
          if (valArray.length > 1) {
            circleNumber = valArray[1].length
          }

          var conutUpDoc = new CountUp(id, val/2, val, circleNumber, 1, {
            // type: Object,
            // default: () => {
            //   return {
            //     useEasing: false,
            //     useGrouping: false,
            //     separator: '',
            //     decimal: '.'
            //   }
            // }

            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.'
          })

          if (!conutUpDoc.error) {
            conutUpDoc.start()
          }
        }, 0)
      } else {
        return val
      }
    }
  }
}
