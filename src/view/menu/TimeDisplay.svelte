<script lang="ts">
  import {onMount} from 'svelte'

  enum TimeState {
    Basic = 1,
    Advanced,
  }

  let timeString = ''
  let dateString = ''
  let timeState = TimeState.Basic

  const timeStringStyle = 'display: none;'
  const timeStringStyleOver = 'font-size: 1.5em;padding-top:15px;'
  const dateStringStyle = 'font-size: 1.5em;padding-top:15px;'
  const dateStringStyleOver = 'font-size: 1em;'
  const buttonStyleOver = ''

  let timeStringStyleCurrent = timeStringStyle
  let dateStringStyleCurrent = dateStringStyle
  let buttonStyleCurrent = timeStringStyle

  const tick = () => {
    timeString = ''
    dateString = ''
    const dt = new Date()

    // Time
    if (dt.getHours() < 10) {
      timeString += `0`
    }
    timeString += `${dt.getHours()}:`
    if (dt.getMinutes() < 10) {
      timeString += `0`
    }
    timeString += `${dt.getMinutes()}:`
    if (dt.getSeconds() < 10) {
      timeString += `0`
    }
    timeString += dt.getSeconds()

    // Date
    if (dt.getDate() < 10) {
      dateString += `0`
    }
    dateString += `${dt.getDate()}-`
    if (dt.getMonth() < 9) {
      dateString += `0`
    }
    dateString += `${dt.getMonth() + 1}-`
    dateString += `${dt.getFullYear()}`
    setTimeout(tick, 500)
  }

  const handleMouseClick = () => {
    if (timeState === TimeState.Basic) {
      timeState = TimeState.Advanced
      dateStringStyleCurrent = dateStringStyleOver
      timeStringStyleCurrent = timeStringStyleOver
      buttonStyleCurrent = buttonStyleOver
    } else {
      timeState = TimeState.Basic
      dateStringStyleCurrent = dateStringStyle
      timeStringStyleCurrent = timeStringStyle
      buttonStyleCurrent = timeStringStyle
    }

  }

  onMount(() => {
    setTimeout(tick, 500)
  })
</script>
<div
  class="time-main"
  on:click={handleMouseClick}>
  <span style="{timeStringStyleCurrent}">{timeString}</span>
  <span style="{dateStringStyleCurrent}">{dateString}</span>
</div>
<style>
  .time-main {
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      text-align: center;
  }
</style>
